import { Masthead } from "@/components/Masthead";
import { TeaCard } from "@/components/TeaCard";
import { TeaPanel } from "@/components/TeaPanel";
import { Toolbar, type SortKey, type TypeFilter } from "@/components/Toolbar";
import { teas } from "@/data/teas";
import { useI18n } from "@/i18n";
import { longDate } from "@/lib/format";
import type { Tea } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const ALL = "all";

export function Shelf() {
  const { t, p, locale } = useI18n();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const { teaId } = useParams<{ teaId: string }>();

  const [query, setQuery] = useState("");
  const type = params.get("type") ?? ALL;
  const sort = (params.get("sort") as SortKey | null) ?? "rating";

  const setParam = useCallback(
    (key: string, value: string, fallback: string) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (value === fallback) next.delete(key);
          else next.set(key, value);
          return next;
        },
        { replace: true },
      );
    },
    [setParams],
  );

  const typeFilters = useMemo<TypeFilter[]>(() => {
    const byKey = new Map<string, TypeFilter>();
    for (const tea of teas) {
      const existing = byKey.get(tea.typeKey);
      byKey.set(tea.typeKey, {
        value: tea.typeKey,
        label: p(tea.type),
        count: (existing?.count ?? 0) + 1,
      });
    }
    return [
      { value: ALL, label: t("all"), count: teas.length },
      ...byKey.values(),
    ];
  }, [p, t]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const matched = teas.filter((tea) => {
      if (type !== ALL && tea.typeKey !== type) return false;
      if (!needle) return true;
      const haystack = [
        tea.name,
        p(tea.origin),
        p(tea.type),
        p(tea.blurb),
        ...tea.notes.map(p),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    

    return matched.slice().sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, locale);
      if (sort === "recent")
        return b.lastBrewed.localeCompare(a.lastBrewed);
      return b.rating - a.rating || a.name.localeCompare(b.name, locale);
    });
  }, [query, type, sort, p, locale]);

  const lastBrewedIso = useMemo(
    () =>
      teas
        .map((tea) => tea.lastBrewed)
        .sort()
        .at(-1) ?? "",
    [],
  );

  const openTea = useMemo(
    () => teas.find((tea) => tea.id === teaId) ?? null,
    [teaId],
  );

  const closePanel = useCallback(() => {
    navigate({ pathname: "/", search: params.toString() }, { replace: true });
  }, [navigate, params]);

  const openPanel = useCallback(
    (tea: Tea) => {
      navigate({ pathname: `/tea/${tea.id}`, search: params.toString() });
    },
    [navigate, params],
  );

  return (
    <div className="shell">
      <Masthead />

      <Toolbar
        types={typeFilters}
        type={type}
        onType={(value) => setParam("type", value, ALL)}
        query={query}
        onQuery={setQuery}
        sort={sort}
        onSort={(value) => setParam("sort", value, "rating")}
      />

      {visible.length > 0 ? (
        <div className="grid">
          {visible.map((tea) => (
            <TeaCard key={tea.id} tea={tea} onOpen={openPanel} />
          ))}
        </div>
      ) : (
        <div className="empty">{t("empty")}</div>
      )}

      <footer className="footer">
        {t("keptByHand")}{" "}
        {lastBrewedIso ? longDate(lastBrewedIso, locale) : "—"}
      </footer>

      {openTea && <TeaPanel tea={openTea} onClose={closePanel} />}
    </div>
  );
}
