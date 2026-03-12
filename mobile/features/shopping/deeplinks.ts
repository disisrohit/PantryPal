import * as Linking from 'expo-linking';
import { ShoppingItem } from './types';

const APP_SCHEMES: Record<string, { web: (q: string) => string; app?: string }> = {
  blinkit: {
    web: (q) => `https://blinkit.com/s/?q=${encodeURIComponent(q)}`,
  },
  zepto: {
    web: (q) => `https://www.zeptonow.com/search?query=${encodeURIComponent(q)}`,
  },
  bigbasket: {
    web: (q) => `https://www.bigbasket.com/ps/?q=${encodeURIComponent(q)}`,
  },
  swiggy_instamart: {
    web: (q) => `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(q)}`,
  },
  jiomart: {
    web: (q) => `https://www.jiomart.com/search/${encodeURIComponent(q)}`,
  },
  amazon_fresh: {
    web: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}&i=nowstore`,
  },
};

export function buildSearchQuery(item: ShoppingItem): string {
  const parts = [];
  if (item.brand) parts.push(item.brand);
  parts.push(item.name);
  parts.push(`${item.quantity}${item.unit}`);
  return parts.join(' ');
}

export async function openInApp(item: ShoppingItem, appKey: string): Promise<void> {
  const scheme = APP_SCHEMES[appKey];
  if (!scheme) return;

  const query = buildSearchQuery(item);
  const url = scheme.web(query);

  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}

export function generateShareText(items: ShoppingItem[]): string {
  const included = items.filter((i) => i.included);
  const lines = included.map((item) => {
    const brand = item.brand ? `${item.brand} ` : '';
    return `- ${brand}${item.name} — ${item.quantity} ${item.unit}`;
  });

  return `PantryPal Shopping List\n${'='.repeat(25)}\n${lines.join('\n')}\n\nTotal: ${included.length} items`;
}

export function generateWhatsAppText(items: ShoppingItem[]): string {
  const included = items.filter((i) => i.included);
  const lines = included.map((item, i) => {
    const brand = item.brand ? `(${item.brand}) ` : '';
    return `${i + 1}. ${item.name} ${brand}— ${item.quantity} ${item.unit}`;
  });

  return `Grocery Order:\n\n${lines.join('\n')}\n\nTotal: ${included.length} items\n\nSent via PantryPal`;
}
