import {
  LocalizationProvider as MuiLocalizationProvider,
  LocalizationProviderProps as MuiLocalizationProviderProps,
} from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

export type LocalizationProviderProps<TDate = Date, TLocale = unknown> = Omit<
  MuiLocalizationProviderProps<Date, TLocale>,
  'dateAdapter'
>;

export function LocalizationProvider(props: LocalizationProviderProps) {
  return <MuiLocalizationProvider {...props} dateAdapter={AdapterDateFns} />;
}

export default LocalizationProvider;
