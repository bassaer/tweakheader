import type { Header, State } from '../models/state';

const RULE_ID = 1;

const enabledHeaders = (state?: Partial<State>): Header[] =>
  state?.running && Array.isArray(state.headers)
    ? state.headers.filter((header) => header.enable && header.name.trim())
    : [];

export const createRule = (state?: Partial<State>): chrome.declarativeNetRequest.Rule | undefined => {
  const headers = enabledHeaders(state);
  if (headers.length === 0) return undefined;

  // One operation per header makes the result deterministic when a saved list
  // happens to contain the same name more than once. The last entry wins.
  const operations = new Map<string, chrome.declarativeNetRequest.ModifyHeaderInfo>();
  for (const header of headers) {
    const name = header.name.trim();
    // "Delete" keeps rules working immediately after upgrading from v0.x,
    // before the options page has migrated the stored state to "Remove".
    operations.set(name.toLowerCase(), header.action === 'Remove' || (header.action as string) === 'Delete'
      ? { header: name, operation: 'remove' as chrome.declarativeNetRequest.HeaderOperation }
      : { header: name, operation: 'set' as chrome.declarativeNetRequest.HeaderOperation, value: header.value });
  }

  return {
    id: RULE_ID,
    priority: 1,
    action: {
      type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
      requestHeaders: [...operations.values()]
    },
    condition: {
      regexFilter: '^https?://',
      resourceTypes: [
        'main_frame',
        'sub_frame',
        'stylesheet',
        'script',
        'image',
        'font',
        'object',
        'xmlhttprequest',
        'ping',
        'csp_report',
        'media',
        'websocket',
        'webtransport',
        'webbundle',
        'other'
      ] as chrome.declarativeNetRequest.ResourceType[]
    }
  };
};

const synchronizeRules = async (state?: Partial<State>) => {
  const rule = createRule(state);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: rule ? [rule] : []
  });
  const count = enabledHeaders(state).length;
  await chrome.action.setBadgeText({ text: state?.running && count ? String(count) : '' });
  await chrome.action.setBadgeBackgroundColor({ color: '#d32f2f' });
};

const synchronizeStoredState = async () => {
  const { state } = await chrome.storage.local.get('state');
  await synchronizeRules(state as State | undefined);
};

chrome.runtime.onInstalled.addListener(() => void synchronizeStoredState());
chrome.runtime.onStartup.addListener(() => void synchronizeStoredState());
chrome.action.onClicked.addListener(() => void chrome.runtime.openOptionsPage());
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.state) {
    void synchronizeRules(changes.state.newValue as State | undefined);
  }
});

void synchronizeStoredState();
