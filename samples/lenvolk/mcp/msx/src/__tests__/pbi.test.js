import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  createPbiClient,
  parseCsvRows,
  parseAccountStackRow,
  parseSummaryRow,
  MSXI_REPORT
} from '../pbi.js';

// ── Sample CSV data matching real PBI exportData output ──────

const ACCOUNT_STACK_CSV = [
  'TPID,TopParent,TimeZone,FieldAccountabilityUnit,STB Mid Segment,MACC,Unified Support,Action,New Logo Inc. Potential Win,GHCP Seats,GHCP Ent Seats,GHCP Business Seats,GHCP Standalone Seats,GHCP ACR ($),GHCP Ent ACR ($),GHCP Business ACR ($),GHCP Standalone ACR ($),ARPU,GHCP Attach,GHCP Seat Oppty,Remaining GHCP Seat Opp,WAU %,WEU %,GHE Total Seats,GHE License Seats,GHE Metered Seats,GHE Metered ACR ($),ADO Seats,PRU Units,PRU ACR ($),GHAS Total Seats,GHAS License Seats,GHAS Metered Seats,GHAS ACR ($),GHAzDO Seats,Visual Studio Seats,SRE ACR ($),AI Foundry ACR ($),AKS ACR ($),Fabric ACR ($),PGSQL ACR ($),CSPM ACR ($),ATU Aliases,ATS Aliases,SSP Aliases,SE Aliases,SE Software Aliases,GH AE Aliases',
  '34771657,DRAFTKINGS,US Eastern,Commercial US East,Enterprise,Yes,No,Grow,,200,150,30,20,$29265,$20000,$6000,$3265,$146,50.3%,398,198,75.2%,60.1%,500,400,100,$5000,200,50,$1234,80,60,20,$8765,10,150,$3456,$7890,$12345,$678,$234,$567,alias1,alias2,alias3,alias4,alias5,alias6'
].join('\n');

const SUMMARY_CSV = [
  'Total GH ACR,GHCP ACR,PRU ACR,GHE met. ACR,GHAS ACR,(blank),GHE Seats (LCM),ADO Seats (LCM),GHCP Seats (LCM),GHCP Seat Oppty,GHCP Attach,(blank),GHAS Seats (LCM),VSS Lic. (LCM),# Acc Unified,# Acc MACC',
  '"$181,744 YTD - $30,371 LCM","$29,265 YTD - $5,000 LCM","$1,234 YTD - $500 LCM","$5,000 YTD - $800 LCM","$8,765 YTD - $1,200 LCM",,500,200,200,398,50.3%,,80,150,3,5'
].join('\n');

describe('parseCsvRows', () => {
  it('parses basic CSV into array of objects', () => {
    const csv = 'Name,Value\nAlpha,100\nBeta,200';
    const rows = parseCsvRows(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ Name: 'Alpha', Value: '100' });
    expect(rows[1]).toEqual({ Name: 'Beta', Value: '200' });
  });

  it('handles quoted fields with commas', () => {
    const csv = 'Label,Amount\n"Item A","$1,234"\n"Item B","$5,678"';
    const rows = parseCsvRows(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0].Amount).toBe('$1,234');
  });

  it('handles quoted fields with embedded quotes', () => {
    const csv = 'Name,Desc\nTest,"""quoted"""\nOther,"a ""b"" c"';
    const rows = parseCsvRows(csv);
    expect(rows[0].Desc).toBe('"quoted"');
    expect(rows[1].Desc).toBe('a "b" c');
  });

  it('handles CRLF line endings', () => {
    const csv = 'A,B\r\n1,2\r\n3,4';
    const rows = parseCsvRows(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ A: '1', B: '2' });
  });

  it('returns empty array for empty/null input', () => {
    expect(parseCsvRows('')).toEqual([]);
    expect(parseCsvRows(null)).toEqual([]);
    expect(parseCsvRows(undefined)).toEqual([]);
  });

  it('returns empty array for header-only CSV', () => {
    expect(parseCsvRows('A,B,C')).toEqual([]);
  });

  it('parses Account Stack CSV correctly', () => {
    const rows = parseCsvRows(ACCOUNT_STACK_CSV);
    expect(rows).toHaveLength(1);
    expect(rows[0].TPID).toBe('34771657');
    expect(rows[0].TopParent).toBe('DRAFTKINGS');
    expect(rows[0]['GHCP ACR ($)']).toBe('$29265');
  });

  it('parses Summary CSV with quoted values containing commas', () => {
    const rows = parseCsvRows(SUMMARY_CSV);
    expect(rows).toHaveLength(1);
    expect(rows[0]['Total GH ACR']).toBe('$181,744 YTD - $30,371 LCM');
    expect(rows[0]['GHE Seats (LCM)']).toBe('500');
  });
});

describe('parseAccountStackRow', () => {
  it('transforms CSV row to structured JSON', () => {
    const rows = parseCsvRows(ACCOUNT_STACK_CSV);
    const result = parseAccountStackRow(rows[0]);

    expect(result.tpid).toBe('34771657');
    expect(result.topParent).toBe('DRAFTKINGS');
    expect(result.ghcp.seats).toBe(200);
    expect(result.ghcp.entSeats).toBe(150);
    expect(result.ghcp.businessSeats).toBe(30);
    expect(result.ghcp.standaloneSeats).toBe(20);
    expect(result.ghcp.acr).toBe(29265);
    expect(result.ghcp.attach).toBe(50.3);
    expect(result.ghcp.seatOppty).toBe(398);
    expect(result.usage.wauPct).toBe(75.2);
    expect(result.usage.weuPct).toBe(60.1);
    expect(result.ghe.totalSeats).toBe(500);
    expect(result.ghe.licenseSeats).toBe(400);
    expect(result.ghe.meteredSeats).toBe(100);
    expect(result.ado.seats).toBe(200);
    expect(result.ghas.totalSeats).toBe(80);
    expect(result.ghas.acr).toBe(8765);
    expect(result.azureAcr.sre).toBe(3456);
    expect(result.azureAcr.aiFoundry).toBe(7890);
    expect(result.azureAcr.aks).toBe(12345);
    expect(result.team.atu).toBe('alias1');
    expect(result.team.ghAe).toBe('alias6');
  });

  it('handles missing/empty fields gracefully', () => {
    const result = parseAccountStackRow({});
    expect(result.tpid).toBeNull();
    expect(result.ghcp.seats).toBeNull();
    expect(result.ghcp.acr).toBeNull();
    expect(result.usage.wauPct).toBeNull();
    expect(result.team.atu).toBeNull();
  });
});

describe('parseSummaryRow', () => {
  it('parses YTD/LCM ACR pairs', () => {
    const rows = parseCsvRows(SUMMARY_CSV);
    const result = parseSummaryRow(rows[0]);

    expect(result.acr.totalGitHub.ytd).toBe(181744);
    expect(result.acr.totalGitHub.lcm).toBe(30371);
    expect(result.acr.ghcp.ytd).toBe(29265);
    expect(result.acr.ghcp.lcm).toBe(5000);
    expect(result.acr.pru.ytd).toBe(1234);
    expect(result.acr.ghas.lcm).toBe(1200);
  });

  it('parses seat counts', () => {
    const rows = parseCsvRows(SUMMARY_CSV);
    const result = parseSummaryRow(rows[0]);

    expect(result.seats.ghe).toBe(500);
    expect(result.seats.ado).toBe(200);
    expect(result.seats.ghcp).toBe(200);
    expect(result.seats.ghcpSeatOppty).toBe(398);
    expect(result.seats.ghcpAttach).toBe(50.3);
    expect(result.seats.ghas).toBe(80);
    expect(result.seats.vss).toBe(150);
  });

  it('parses account counts', () => {
    const rows = parseCsvRows(SUMMARY_CSV);
    const result = parseSummaryRow(rows[0]);

    expect(result.accounts.unified).toBe(3);
    expect(result.accounts.macc).toBe(5);
  });
});

describe('createPbiClient', () => {
  let client;

  beforeEach(() => {
    client = createPbiClient();
  });

  describe('saveExtractedData', () => {
    it('parses and caches Account Stack + Summary CSVs', () => {
      const result = client.saveExtractedData('34771657', {
        accountStackCsv: ACCOUNT_STACK_CSV,
        summaryCsv: SUMMARY_CSV
      });

      expect(result.tpid).toBe('34771657');
      expect(result.retrievedAt).toBeTruthy();
      expect(result.accountCount).toBe(1);
      expect(result.accounts[0].topParent).toBe('DRAFTKINGS');
      expect(result.accounts[0].ghcp.acr).toBe(29265);
      expect(result.summary.acr.totalGitHub.ytd).toBe(181744);
      expect(result.summary.seats.ghcp).toBe(200);
    });

    it('returns data from memory cache on subsequent get', async () => {
      client.saveExtractedData('34771657', {
        accountStackCsv: ACCOUNT_STACK_CSV,
        summaryCsv: SUMMARY_CSV
      });

      const cached = await client.getGitHubStackSummary('34771657');
      expect(cached.tpid).toBe('34771657');
      expect(cached.accounts[0].topParent).toBe('DRAFTKINGS');
    });

    it('works with Account Stack CSV only (no Summary)', () => {
      const result = client.saveExtractedData('34771657', {
        accountStackCsv: ACCOUNT_STACK_CSV,
        summaryCsv: ''
      });

      expect(result.summary).toBeNull();
      expect(result.accounts).toHaveLength(1);
    });
  });

  describe('getGitHubStackSummary', () => {
    it('returns needsExtraction when no cache exists', async () => {
      const result = await client.getGitHubStackSummary('99999999');
      expect(result.tpid).toBe('99999999');
      expect(result.data).toBeNull();
      expect(result.needsExtraction).toBe(true);
      expect(result.message).toContain('gh-stack-browser-extraction');
    });
  });

  describe('clearCache', () => {
    it('clears in-memory cache', () => {
      client.saveExtractedData('34771657', {
        accountStackCsv: ACCOUNT_STACK_CSV,
        summaryCsv: SUMMARY_CSV
      });
      expect(client.cache.size).toBe(1);
      client.clearCache();
      expect(client.cache.size).toBe(0);
    });
  });
});

describe('MSXI_REPORT constants', () => {
  it('has all required report IDs', () => {
    expect(MSXI_REPORT.pbiReportId).toBe('0d5f46d6-5d27-4f78-82d6-8be082dd6c9b');
    expect(MSXI_REPORT.groupId).toBe('824003d8-7e9b-4d4a-aa2a-fe295b23549e');
    expect(MSXI_REPORT.datasetId).toBe('a0239518-1109-45a3-a3eb-1872dc10ac15');
    expect(MSXI_REPORT.slicerTable).toBe('Dim_Account');
    expect(MSXI_REPORT.slicerColumn).toBe('TPID_Text');
  });
});
