import FocusAreaPage from '../components/FocusAreaPage';
import { focusAreaConfigs } from '../lib/focusAreaData';

export default function FocusAreaEnvironment() {
  return <FocusAreaPage config={focusAreaConfigs[1]} />;
}
