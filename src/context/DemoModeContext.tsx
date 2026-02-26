import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface DemoOverrides {
  organizationName: string;
  region: string;
  sampleFarmNames: string; // comma-separated
  scaleFactor: number; // 1, 2, 5, 10
}

interface DemoModeState {
  enabled: boolean;
  overrides: DemoOverrides;
}

interface DemoModeContextValue extends DemoModeState {
  toggleDemo: () => void;
  setEnabled: (v: boolean) => void;
  updateOverrides: (patch: Partial<DemoOverrides>) => void;
  resetOverrides: () => void;
  /** Resolve a display value: returns override when demo is on, default otherwise */
  demoValue: <T>(defaultVal: T, overrideVal: T | undefined) => T;
  /** Scale a number by the demo scale factor (only when demo mode is on) */
  demoScale: (val: number) => number;
  /** Get farm name replacement: picks from sample names by index */
  demoFarmName: (defaultName: string, index: number) => string;
  /** Get organization name */
  demoOrgName: (defaultName: string) => string;
  /** Get region override */
  demoRegion: (defaultRegion: string) => string;
}

const DEFAULT_OVERRIDES: DemoOverrides = {
  organizationName: '',
  region: '',
  sampleFarmNames: '',
  scaleFactor: 1,
};

const DemoModeContext = createContext<DemoModeContextValue | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoModeState>({
    enabled: false,
    overrides: { ...DEFAULT_OVERRIDES },
  });

  const toggleDemo = useCallback(() => {
    setState((prev) => ({ ...prev, enabled: !prev.enabled }));
  }, []);

  const setEnabled = useCallback((v: boolean) => {
    setState((prev) => ({ ...prev, enabled: v }));
  }, []);

  const updateOverrides = useCallback((patch: Partial<DemoOverrides>) => {
    setState((prev) => ({
      ...prev,
      overrides: { ...prev.overrides, ...patch },
    }));
  }, []);

  const resetOverrides = useCallback(() => {
    setState({ enabled: false, overrides: { ...DEFAULT_OVERRIDES } });
  }, []);

  const demoValue = useCallback(
    <T,>(defaultVal: T, overrideVal: T | undefined): T => {
      if (!state.enabled || overrideVal === undefined || overrideVal === '') return defaultVal;
      return overrideVal;
    },
    [state.enabled]
  );

  const demoScale = useCallback(
    (val: number): number => {
      if (!state.enabled) return val;
      return Math.round(val * state.overrides.scaleFactor);
    },
    [state.enabled, state.overrides.scaleFactor]
  );

  const demoFarmName = useCallback(
    (defaultName: string, index: number): string => {
      if (!state.enabled || !state.overrides.sampleFarmNames.trim()) return defaultName;
      const names = state.overrides.sampleFarmNames
        .split(',')
        .map((n) => n.trim())
        .filter(Boolean);
      if (names.length === 0) return defaultName;
      return names[index % names.length];
    },
    [state.enabled, state.overrides.sampleFarmNames]
  );

  const demoOrgName = useCallback(
    (defaultName: string): string => {
      if (!state.enabled || !state.overrides.organizationName.trim()) return defaultName;
      return state.overrides.organizationName;
    },
    [state.enabled, state.overrides.organizationName]
  );

  const demoRegion = useCallback(
    (defaultRegion: string): string => {
      if (!state.enabled || !state.overrides.region.trim()) return defaultRegion;
      return state.overrides.region;
    },
    [state.enabled, state.overrides.region]
  );

  return (
    <DemoModeContext.Provider
      value={{
        enabled: state.enabled,
        overrides: state.overrides,
        toggleDemo,
        setEnabled,
        updateOverrides,
        resetOverrides,
        demoValue,
        demoScale,
        demoFarmName,
        demoOrgName,
        demoRegion,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode(): DemoModeContextValue {
  const ctx = useContext(DemoModeContext);
  if (!ctx) {
    throw new Error('useDemoMode must be used inside <DemoModeProvider>');
  }
  return ctx;
}
