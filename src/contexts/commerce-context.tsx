import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/* ============================================================
   TYPES
============================================================ */
export type Product = {
  id: string;
  slug: string;
  title: string;
  brand?: string;
  price: number; // base USD
  compareAt?: number;
  image: string;
  imageAlt?: string;
  rating?: number;
  reviews?: number;
  badge?: "best-seller" | "trending" | "new" | "limited";
  freeShipping?: boolean;
  fastDelivery?: boolean;
  variants?: { id: string; label: string; swatch?: string }[];
};

export type CartLine = {
  id: string; // line id
  product: Product;
  variantId?: string;
  qty: number;
};

export type Country = {
  code: string;
  name: string;
  nameAr: string;
  flag: string;
  currency: string;
  symbol: string;
  rate: number; // multiplier vs USD base
  lang: "ar" | "en";
  shipping: string;
  shippingAr: string;
};

export const COUNTRIES: Country[] = [
  {
    code: "EG",
    name: "Egypt",
    nameAr: "ظ…طµط±",
    flag: "ًں‡ھًں‡¬",
    currency: "EGP",
    symbol: "ط¬.ظ…",
    rate: 48.5,
    lang: "ar",
    shipping: "3â€“6 days",
    shippingAr: "ظ£â€“ظ¦ ط£ظٹط§ظ…",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    nameAr: "ط§ظ„ط³ط¹ظˆط¯ظٹط©",
    flag: "ًں‡¸ًں‡¦",
    currency: "SAR",
    symbol: "ط±.ط³",
    rate: 3.75,
    lang: "ar",
    shipping: "1â€“3 days",
    shippingAr: "ظ،â€“ظ£ ط£ظٹط§ظ…",
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    nameAr: "ط§ظ„ط¥ظ…ط§ط±ط§طھ",
    flag: "ًں‡¦ًں‡ھ",
    currency: "AED",
    symbol: "ط¯.ط¥",
    rate: 3.67,
    lang: "ar",
    shipping: "1â€“2 days",
    shippingAr: "ظ،â€“ظ¢ ظٹظˆظ…",
  },
  {
    code: "QA",
    name: "Qatar",
    nameAr: "ظ‚ط·ط±",
    flag: "ًں‡¶ًں‡¦",
    currency: "QAR",
    symbol: "ط±.ظ‚",
    rate: 3.64,
    lang: "ar",
    shipping: "2â€“4 days",
    shippingAr: "ظ¢â€“ظ¤ ط£ظٹط§ظ…",
  },
  {
    code: "KW",
    name: "Kuwait",
    nameAr: "ط§ظ„ظƒظˆظٹطھ",
    flag: "ًں‡°ًں‡¼",
    currency: "KWD",
    symbol: "ط¯.ظƒ",
    rate: 0.31,
    lang: "ar",
    shipping: "2â€“4 days",
    shippingAr: "ظ¢â€“ظ¤ ط£ظٹط§ظ…",
  },
  {
    code: "BH",
    name: "Bahrain",
    nameAr: "ط§ظ„ط¨ط­ط±ظٹظ†",
    flag: "ًں‡§ًں‡­",
    currency: "BHD",
    symbol: "ط¯.ط¨",
    rate: 0.38,
    lang: "ar",
    shipping: "2â€“4 days",
    shippingAr: "ظ¢â€“ظ¤ ط£ظٹط§ظ…",
  },
  {
    code: "OM",
    name: "Oman",
    nameAr: "ط¹ظڈظ…ط§ظ†",
    flag: "ًں‡´ًں‡²",
    currency: "OMR",
    symbol: "ط±.ط¹",
    rate: 0.38,
    lang: "ar",
    shipping: "2â€“4 days",
    shippingAr: "ظ¢â€“ظ¤ ط£ظٹط§ظ…",
  },
  {
    code: "JO",
    name: "Jordan",
    nameAr: "ط§ظ„ط£ط±ط¯ظ†",
    flag: "ًں‡¯ًں‡´",
    currency: "JOD",
    symbol: "ط¯.ط£",
    rate: 0.71,
    lang: "ar",
    shipping: "3â€“5 days",
    shippingAr: "ظ£â€“ظ¥ ط£ظٹط§ظ…",
  },
  {
    code: "IQ",
    name: "Iraq",
    nameAr: "ط§ظ„ط¹ط±ط§ظ‚",
    flag: "ًں‡®ًں‡¶",
    currency: "IQD",
    symbol: "ط¯.ط¹",
    rate: 1310,
    lang: "ar",
    shipping: "4â€“7 days",
    shippingAr: "ظ¤â€“ظ§ ط£ظٹط§ظ…",
  },
  {
    code: "TR",
    name: "Turkey",
    nameAr: "طھط±ظƒظٹط§",
    flag: "ًں‡¹ًں‡·",
    currency: "TRY",
    symbol: "â‚؛",
    rate: 34,
    lang: "en",
    shipping: "3â€“6 days",
    shippingAr: "ظ£â€“ظ¦ ط£ظٹط§ظ…",
  },
  {
    code: "GB",
    name: "United Kingdom",
    nameAr: "ط§ظ„ظ…ظ…ظ„ظƒط© ط§ظ„ظ…طھط­ط¯ط©",
    flag: "ًں‡¬ًں‡§",
    currency: "GBP",
    symbol: "آ£",
    rate: 0.79,
    lang: "en",
    shipping: "4â€“7 days",
    shippingAr: "ظ¤â€“ظ§ ط£ظٹط§ظ…",
  },
  {
    code: "DE",
    name: "Germany",
    nameAr: "ط£ظ„ظ…ط§ظ†ظٹط§",
    flag: "ًں‡©ًں‡ھ",
    currency: "EUR",
    symbol: "â‚¬",
    rate: 0.93,
    lang: "en",
    shipping: "4â€“7 days",
    shippingAr: "ظ¤â€“ظ§ ط£ظٹط§ظ…",
  },
  {
    code: "FR",
    name: "France",
    nameAr: "ظپط±ظ†ط³ط§",
    flag: "ًں‡«ًں‡·",
    currency: "EUR",
    symbol: "â‚¬",
    rate: 0.93,
    lang: "en",
    shipping: "4â€“7 days",
    shippingAr: "ظ¤â€“ظ§ ط£ظٹط§ظ…",
  },
  {
    code: "CA",
    name: "Canada",
    nameAr: "ظƒظ†ط¯ط§",
    flag: "ًں‡¨ًں‡¦",
    currency: "CAD",
    symbol: "C$",
    rate: 1.36,
    lang: "en",
    shipping: "5â€“8 days",
    shippingAr: "ظ¥â€“ظ¨ ط£ظٹط§ظ…",
  },
  {
    code: "US",
    name: "United States",
    nameAr: "ط§ظ„ظˆظ„ط§ظٹط§طھ ط§ظ„ظ…طھط­ط¯ط©",
    flag: "ًں‡؛ًں‡¸",
    currency: "USD",
    symbol: "$",
    rate: 1,
    lang: "en",
    shipping: "5â€“8 days",
    shippingAr: "ظ¥â€“ظ¨ ط£ظٹط§ظ…",
  },
];

/* ============================================================
   STORAGE
============================================================ */
const ls = {
  get<T>(k: string, fb: T): T {
    try {
      if (typeof window === "undefined") return fb;
      const v = window.localStorage.getItem(k);
      return v ? (JSON.parse(v) as T) : fb;
    } catch {
      return fb;
    }
  },
  set(k: string, v: unknown) {
    try {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(k, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  },
};

/* ============================================================
   COUNTRY
============================================================ */
type CountryCtx = {
  country: Country;
  setCountry: (code: string) => void;
  format: (usd: number) => string;
  countries: Country[];
};
const CountryContext = createContext<CountryCtx | null>(null);

export function useCountry() {
  const c = useContext(CountryContext);
  if (!c) throw new Error("useCountry must be used within CommerceProvider");
  return c;
}

/* ============================================================
   CART
============================================================ */
type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number; // USD base
  add: (p: Product, qty?: number, variantId?: string, origin?: DOMRect) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  flyOrigin: DOMRect | null;
  flyNonce: number;
  bumpNonce: number;
};
const CartContext = createContext<CartCtx | null>(null);

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used within CommerceProvider");
  return c;
}

/* ============================================================
   WISHLIST
============================================================ */
type WishCtx = {
  items: Product[];
  has: (id: string) => boolean;
  toggle: (p: Product) => void;
  remove: (id: string) => void;
  count: number;
};
const WishContext = createContext<WishCtx | null>(null);

export function useWishlist() {
  const c = useContext(WishContext);
  if (!c) throw new Error("useWishlist must be used within CommerceProvider");
  return c;
}

/* ============================================================
   PROVIDER
============================================================ */
const CART_KEY = "rwgh.cart.v1";
const WISH_KEY = "rwgh.wishlist.v1";
const COUNTRY_KEY = "rwgh.country.v1";

export function CommerceProvider({ children }: { children: ReactNode }) {
  // Country
  const [countryCode, setCountryCode] = useState<string>("SA");
  useEffect(() => {
    const saved = ls.get<string | null>(COUNTRY_KEY, null);
    if (saved) setCountryCode(saved);
    else {
      // naive locale-based detection
      try {
        const loc = (navigator.language || "").toUpperCase();
        const m = COUNTRIES.find((c) => loc.endsWith("-" + c.code));
        if (m) setCountryCode(m.code);
      } catch {
        /* ignore */
      }
    }
  }, []);
  const country = useMemo(
    () => COUNTRIES.find((c) => c.code === countryCode) || COUNTRIES[1],
    [countryCode],
  );
  const setCountry = useCallback((code: string) => {
    setCountryCode(code);
    ls.set(COUNTRY_KEY, code);
  }, []);
  const format = useCallback(
    (usd: number) => {
      const v = usd * country.rate;
      const decimals = v >= 100 ? 0 : 2;
      return `${country.symbol} ${v.toLocaleString(undefined, { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}`;
    },
    [country],
  );

  // Cart
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [flyOrigin, setFlyOrigin] = useState<DOMRect | null>(null);
  const [flyNonce, setFlyNonce] = useState(0);
  const [bumpNonce, setBumpNonce] = useState(0);

  useEffect(() => {
    setLines(ls.get<CartLine[]>(CART_KEY, []));
  }, []);
  useEffect(() => {
    ls.set(CART_KEY, lines);
  }, [lines]);

  const add = useCallback<CartCtx["add"]>((product, qty = 1, variantId, origin) => {
    setLines((prev) => {
      const key = product.id + "::" + (variantId ?? "");
      const idx = prev.findIndex((l) => l.id === key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { id: key, product, variantId, qty }];
    });
    if (origin) {
      setFlyOrigin(origin);
      setFlyNonce((n) => n + 1);
    }
    setBumpNonce((n) => n + 1);
  }, []);

  const remove = useCallback((id: string) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);
  const setQty = useCallback((id: string, qty: number) => {
    setLines((prev) =>
      prev.map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l)).filter((l) => l.qty > 0),
    );
  }, []);
  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.product.price * l.qty, 0), [lines]);

  // Wishlist
  const [wish, setWish] = useState<Product[]>([]);
  useEffect(() => {
    setWish(ls.get<Product[]>(WISH_KEY, []));
  }, []);
  useEffect(() => {
    ls.set(WISH_KEY, wish);
  }, [wish]);

  const wishHas = useCallback((id: string) => wish.some((w) => w.id === id), [wish]);
  const wishToggle = useCallback((p: Product) => {
    setWish((prev) =>
      prev.some((w) => w.id === p.id) ? prev.filter((w) => w.id !== p.id) : [...prev, p],
    );
  }, []);
  const wishRemove = useCallback((id: string) => {
    setWish((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return (
    <CountryContext.Provider value={{ country, setCountry, format, countries: COUNTRIES }}>
      <CartContext.Provider
        value={{
          lines,
          count,
          subtotal,
          add,
          remove,
          setQty,
          clear,
          open,
          setOpen,
          flyOrigin,
          flyNonce,
          bumpNonce,
        }}
      >
        <WishContext.Provider
          value={{
            items: wish,
            has: wishHas,
            toggle: wishToggle,
            remove: wishRemove,
            count: wish.length,
          }}
        >
          {children}
        </WishContext.Provider>
      </CartContext.Provider>
    </CountryContext.Provider>
  );
}


