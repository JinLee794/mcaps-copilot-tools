// useSkillLoader — loads skills from .github/skills/ via IPC and manages active selection
import { useState, useEffect, useCallback } from 'react';
import type { SkillDefinition } from '../../shared/types/SkillDefinition';

declare global {
  interface Window {
    electronAPI: import('../../main/preload').ElectronAPI;
  }
}

interface SkillTunerParams {
  accountContext: string;
  timeWindow: string;
  depth: 1 | 2 | 3;
  outputFormat: string;
}

export function useSkillLoader() {
  const [skills, setSkills] = useState<SkillDefinition[]>([]);
  const [activeSkill, setActiveSkill] = useState<SkillDefinition | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // Load skills on mount
  useEffect(() => {
    async function load() {
      if (!window.electronAPI) return;
      try {
        const result = await window.electronAPI.skills.list();
        const loaded = (result as { skills: Array<Record<string, unknown>> }).skills ?? [];
        setSkills(loaded as unknown as SkillDefinition[]);
      } catch (err) {
        console.error('Failed to load skills:', err);
      }
    }
    load();
  }, []);

  const selectSkill = useCallback(
    (skillId: string) => {
      const skill = skills.find((s) => s.id === skillId) ?? null;
      setActiveSkill(skill);
    },
    [skills],
  );

  const runSkill = useCallback(
    async (skillId: string, prompt: string, tunerParams: SkillTunerParams) => {
      if (!window.electronAPI) return;
      setIsRunning(true);
      try {
        await window.electronAPI.copilot.run({
          skill: skillId,
          prompt,
          context: tunerParams as unknown as Record<string, unknown>,
        });
      } finally {
        setIsRunning(false);
      }
    },
    [],
  );

  return {
    skills,
    activeSkill,
    selectSkill,
    runSkill,
    isRunning,
  };
}
