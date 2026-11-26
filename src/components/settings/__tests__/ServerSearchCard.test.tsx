jest.mock('../../../store/persistence/kvStorage', () =>
  require('../../../store/persistence/__mocks__/kvStorage'),
);

import { fireEvent, render, screen } from '@testing-library/react-native';

import { kvStorage } from '../../../store/persistence';
import { searchSettingsStore } from '../../../store/searchSettingsStore';
import { ServerSearchCard } from '../ServerSearchCard';

it('defaults to on and persists an opt-out from the switch', async () => {
  render(<ServerSearchCard />);
  const label = 'Include server search results';
  expect(screen.getByLabelText(label)).toHaveProp('accessibilityState', { checked: true });

  fireEvent(screen.getByLabelText(label), 'valueChange', false);

  expect(screen.getByLabelText(label)).toHaveProp('accessibilityState', { checked: false });
  const options = searchSettingsStore.persist.getOptions();
  const saved = await kvStorage.getItem(options.name!);
  expect(saved && JSON.parse(saved).state).toEqual({ alwaysSearchServer: false });
});
