import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { useRepositories } from "@/hooks/use-public-content";
import { useProjectSettings } from "@/hooks/use-project-settings";
import {
  validateProjectSettings,
  type ProjectSettings,
} from "@/lib/core/projects";

export function ProjectManager() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [draft, setDraft] = useState({
    name: "",
    url: "",
    description: "",
    language: "",
  });
  const settings = useProjectSettings();
  const repos = useRepositories();
  const client = useQueryClient();
  const config = settings.data;
  const unlock = async () => {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}api/projects`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok)
        throw new Error(
          "Could not unlock. Check your publishing key and try again.",
        );
      setEditing(true);
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const save = async (next: ProjectSettings) => {
    setBusy(true);
    setStatus("");
    try {
      validateProjectSettings(next);
      const response = await fetch(`${import.meta.env.BASE_URL}api/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(next),
        signal: AbortSignal.timeout(12_000),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error ?? "Could not save projects.");
      client.setQueryData(["project-settings"], validateProjectSettings(data));
      setEditing(true);
      setAdding(false);
      setDraft({ name: "", url: "", description: "", language: "" });
      setStatus("Saved to your public portfolio.");
    } catch (error) {
      setStatus((error as Error).message);
    } finally {
      setBusy(false);
    }
  };
  const all = config
    ? [
        ...repos.data.items,
        ...config.additions.filter(
          (p) => !repos.data.items.some((r) => r.url === p.url),
        ),
      ]
    : [];
  return (
    <div className="project-manager mb-6">
      <button
        className="action-link"
        aria-expanded={open}
        onClick={() => {
          setOpen(!open);
          if (open) {
            setKey("");
            setEditing(false);
          }
        }}
      >
        Manage projects
      </button>
      {open && (
        <section
          aria-label="Owner project controls"
          className="mt-4 border border-border bg-card p-5"
        >
          <h2 className="font-semibold">Your project collection</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Delete hides a project from this site. You can add it back anytime;
            its GitHub repository stays intact.
          </p>
          {!editing && (
            <form
              className="mt-4 flex flex-wrap items-end gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                void unlock();
              }}
            >
              <label className="text-sm">
                Owner publishing key
                <input
                  type="password"
                  autoComplete="off"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="mt-2 block w-full border border-border bg-background p-3"
                />
              </label>
              <button
                className="owner-button"
                disabled={busy || key.length < 32 || !config}
              >
                {busy ? "Checking…" : "Unlock editing"}
              </button>
              <p className="w-full text-xs text-muted-foreground">
                Use the same key as Investing. It stays in memory only.
              </p>
            </form>
          )}
          {settings.isError && (
            <p className="mt-3 text-sm" role="alert">
              Settings couldn’t load.{" "}
              <button
                className="underline"
                onClick={() => void settings.refetch()}
              >
                Retry
              </button>
            </p>
          )}
          {editing && config && (
            <>
              <div className="my-4 flex flex-wrap gap-4">
                <button
                  className="owner-button"
                  onClick={() => setAdding(!adding)}
                  disabled={busy}
                >
                  <Plus size={15} /> Add project
                </button>
                <button
                  className="action-link"
                  disabled={busy}
                  onClick={() => {
                    setEditing(false);
                    setKey("");
                  }}
                >
                  Lock editing
                </button>
              </div>
              {adding && (
                <form
                  className="mb-5 grid gap-3 sm:grid-cols-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const url = draft.url.trim().replace(/\/$/, "");
                    if (all.some((p) => p.url === url)) {
                      setStatus(
                        "This project already exists. Use Add back if it is hidden.",
                      );
                      return;
                    }
                    void save({
                      ...config,
                      additions: [
                        ...config.additions,
                        {
                          ...draft,
                          name: draft.name.trim(),
                          url,
                          language: draft.language.trim() || "Project",
                        },
                      ],
                    });
                  }}
                >
                  <label className="text-sm">
                    Project name
                    <input
                      required
                      maxLength={100}
                      value={draft.name}
                      onChange={(e) =>
                        setDraft({ ...draft, name: e.target.value })
                      }
                      className="owner-input"
                    />
                  </label>
                  <label className="text-sm">
                    Project URL
                    <input
                      required
                      type="url"
                      placeholder="https://…"
                      maxLength={500}
                      value={draft.url}
                      onChange={(e) =>
                        setDraft({ ...draft, url: e.target.value })
                      }
                      className="owner-input"
                    />
                  </label>
                  <label className="text-sm">
                    Technology / category
                    <input
                      maxLength={60}
                      value={draft.language}
                      onChange={(e) =>
                        setDraft({ ...draft, language: e.target.value })
                      }
                      className="owner-input"
                    />
                  </label>
                  <label className="text-sm">
                    Description
                    <textarea
                      maxLength={1000}
                      value={draft.description}
                      onChange={(e) =>
                        setDraft({ ...draft, description: e.target.value })
                      }
                      className="owner-input"
                    />
                  </label>
                  <button className="owner-button w-fit" disabled={busy}>
                    Save project
                  </button>
                </form>
              )}
              <ul className="divide-y divide-border">
                {all.map((project) => {
                  const hidden = config.hidden.includes(project.url);
                  return (
                    <li
                      key={project.url}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <span className="min-w-0 break-words text-sm">
                        {project.name}
                        {hidden && (
                          <span className="ml-2 text-muted-foreground">
                            Hidden
                          </span>
                        )}
                      </span>
                      <button
                        disabled={busy}
                        className="inline-flex shrink-0 items-center gap-2 text-sm underline underline-offset-4"
                        aria-label={`${hidden ? "Add back" : "Delete"} ${project.name}`}
                        onClick={() =>
                          void save({
                            ...config,
                            hidden: hidden
                              ? config.hidden.filter(
                                  (url) => url !== project.url,
                                )
                              : [...config.hidden, project.url],
                          })
                        }
                      >
                        {hidden ? (
                          <RotateCcw size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                        {hidden ? "Add back" : "Delete"}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
          <p role="status" className="mt-3 text-sm">
            {status}
          </p>
        </section>
      )}
    </div>
  );
}
