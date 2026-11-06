import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminPanel,
  CheckboxField,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-ui";
import {
  createGithubEntry,
  deleteGithubEntry,
  deleteGithubHost,
  deleteGithubSnapshot,
  deleteGithubTopic,
  saveGithubHost,
  saveGithubSnapshot,
  saveGithubTopic,
  updateGithubEntry,
} from "@/lib/admin/actions";
import type { getAdminGithubEntry } from "@/lib/admin/queries";
import { toDateTimeLocal } from "@/lib/admin/format";

type GithubEntryRecord = NonNullable<
  Awaited<ReturnType<typeof getAdminGithubEntry>>
>;

type ProjectOption = {
  id: string;
  title: string;
  sortOrder: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

type GithubEntryValue = {
  id?: string;
  projectId: string | null;
  position: number;
  repositoryFullName: string;
  label: string | null;
  descriptionOverride: string | null;
  isVisible: boolean;
};

export function GithubEntryForm({
  entry,
  projects,
}: {
  entry?: GithubEntryValue;
  projects: ProjectOption[];
}) {
  const editing = Boolean(entry?.id);

  return (
    <AdminPanel
      id="github-entry"
      title={editing ? "Showcase details" : "New GitHub entry"}
      description="Curate a repository, its public label, and its relationship to an authored project."
    >
      <AdminForm
        action={editing ? updateGithubEntry : createGithubEntry}
        submitLabel={editing ? "Save GitHub entry" : "Create GitHub entry"}
      >
        {entry?.id ? <input type="hidden" name="id" value={entry.id} /> : null}
        <div className="admin-form-grid admin-form-grid--two">
          <TextField
            label="Repository"
            name="repositoryFullName"
            defaultValue={entry?.repositoryFullName ?? ""}
            maxLength={191}
            placeholder="owner/repository"
            hint="Stored in lowercase as the unique repository identifier."
            required
          />
          <TextField
            label="Showcase position"
            name="position"
            type="number"
            min={1}
            defaultValue={entry?.position ?? 1}
            required
          />
          <TextField
            label="Display label"
            name="label"
            defaultValue={entry?.label ?? ""}
            maxLength={120}
            hint="Optional short label shown instead of the repository name."
          />
          <SelectField
            label="Linked project"
            name="projectId"
            defaultValue={entry?.projectId ?? ""}
            hint="Optional. An authored project can have one GitHub entry."
          >
            <option value="">No linked project</option>
            {projects.map((project) => (
              <option value={project.id} key={project.id}>
                {String(project.sortOrder).padStart(2, "0")} / {project.title}
              </option>
            ))}
          </SelectField>
          <TextAreaField
            label="Description override"
            name="descriptionOverride"
            defaultValue={entry?.descriptionOverride ?? ""}
            rows={5}
            hint="Leave blank to use the repository snapshot description."
            className="admin-field--wide"
          />
          <CheckboxField
            label="Visible on the public site"
            name="isVisible"
            defaultChecked={entry?.isVisible ?? true}
            hint="Hidden entries remain available in the admin dashboard."
          />
        </div>
      </AdminForm>
    </AdminPanel>
  );
}

export function GithubRelations({ entry }: { entry: GithubEntryRecord }) {
  const snapshot = entry.snapshot;
  const nextHostPosition =
    Math.max(0, ...entry.allowedHosts.map((host) => host.position)) + 1;
  const nextTopicPosition =
    Math.max(0, ...(snapshot?.topics.map((topic) => topic.position) ?? [])) + 1;

  return (
    <>
      <AdminPanel
        id="allowed-hosts"
        title="Allowed homepage hosts"
        description="Hostnames approved when rendering the repository homepage preview."
      >
        <div className="admin-records">
          {entry.allowedHosts.map((host) => (
            <details className="admin-record" key={host.id}>
              <summary>
                <span>{String(host.position).padStart(2, "0")}</span>
                <div>
                  <strong>{host.host}</strong>
                  <small>Approved homepage host</small>
                </div>
                <i>Edit</i>
              </summary>
              <AdminForm action={saveGithubHost} submitLabel="Save host">
                <input type="hidden" name="entryId" value={entry.id} />
                <input type="hidden" name="id" value={host.id} />
                <HostFields host={host} />
              </AdminForm>
              <AdminForm
                action={deleteGithubHost}
                submitLabel="Delete host"
                submitTone="danger"
                confirmText={`Remove ${host.host}?`}
                className="admin-delete-form"
              >
                <input type="hidden" name="entryId" value={entry.id} />
                <input type="hidden" name="id" value={host.id} />
              </AdminForm>
            </details>
          ))}
          <details className="admin-add-record" open={!entry.allowedHosts.length}>
            <summary>
              Add allowed host <span aria-hidden="true">+</span>
            </summary>
            <AdminForm action={saveGithubHost} submitLabel="Add host">
              <input type="hidden" name="entryId" value={entry.id} />
              <HostFields position={nextHostPosition} />
            </AdminForm>
          </details>
        </div>
      </AdminPanel>

      <AdminPanel
        id="snapshot"
        title="Repository snapshot"
        description="Cached GitHub facts used when a live lookup is unavailable."
      >
        <AdminForm action={saveGithubSnapshot} submitLabel="Save snapshot">
          <input type="hidden" name="entryId" value={entry.id} />
          <div className="admin-form-grid admin-form-grid--two">
            <TextField
              label="GitHub repository ID"
              name="githubRepositoryId"
              defaultValue={
                entry.snapshot?.githubRepositoryId.toString() ?? ""
              }
              inputMode="numeric"
              pattern="[0-9]+"
              required
            />
            <TextField
              label="Language"
              name="language"
              defaultValue={entry.snapshot?.language ?? ""}
              maxLength={100}
            />
            <TextField
              label="Homepage URL"
              name="homepageUrl"
              type="url"
              defaultValue={entry.snapshot?.homepageUrl ?? ""}
            />
            <TextField
              label="Repository updated"
              name="repositoryUpdatedAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(
                entry.snapshot?.repositoryUpdatedAt,
              )}
              required
            />
            <TextField
              label="Checked at"
              name="checkedAt"
              type="datetime-local"
              defaultValue={toDateTimeLocal(entry.snapshot?.checkedAt)}
              required
            />
            <TextAreaField
              label="Repository description"
              name="description"
              defaultValue={entry.snapshot?.description ?? ""}
              rows={4}
              className="admin-field--wide"
            />
            <CheckboxField
              label="Repository is archived"
              name="archived"
              defaultChecked={entry.snapshot?.archived}
            />
            <CheckboxField
              label="Repository is a fork"
              name="fork"
              defaultChecked={entry.snapshot?.fork}
            />
          </div>
        </AdminForm>
        {entry.snapshot ? (
          <AdminForm
            action={deleteGithubSnapshot}
            submitLabel="Delete snapshot"
            submitTone="danger"
            confirmText="Delete this GitHub snapshot and all of its topics?"
            className="admin-delete-form"
          >
            <input type="hidden" name="entryId" value={entry.id} />
          </AdminForm>
        ) : null}
      </AdminPanel>

      {snapshot ? (
        <AdminPanel
          id="topics"
          title="Repository topics"
          description="Ordered topic labels stored with this snapshot."
        >
          <div className="admin-records">
            {snapshot.topics.map((topic) => (
              <details className="admin-record" key={topic.id}>
                <summary>
                  <span>{String(topic.position).padStart(2, "0")}</span>
                  <div>
                    <strong>{topic.name}</strong>
                    <small>Snapshot topic</small>
                  </div>
                  <i>Edit</i>
                </summary>
                <AdminForm action={saveGithubTopic} submitLabel="Save topic">
                  <input type="hidden" name="entryId" value={entry.id} />
                  <input
                    type="hidden"
                    name="snapshotId"
                    value={snapshot.id}
                  />
                  <input type="hidden" name="id" value={topic.id} />
                  <TopicFields topic={topic} />
                </AdminForm>
                <AdminForm
                  action={deleteGithubTopic}
                  submitLabel="Delete topic"
                  submitTone="danger"
                  confirmText={`Delete topic "${topic.name}"?`}
                  className="admin-delete-form"
                >
                  <input type="hidden" name="entryId" value={entry.id} />
                  <input
                    type="hidden"
                    name="snapshotId"
                    value={snapshot.id}
                  />
                  <input type="hidden" name="id" value={topic.id} />
                </AdminForm>
              </details>
            ))}
            <details
              className="admin-add-record"
              open={!snapshot.topics.length}
            >
              <summary>
                Add topic <span aria-hidden="true">+</span>
              </summary>
              <AdminForm action={saveGithubTopic} submitLabel="Add topic">
                <input type="hidden" name="entryId" value={entry.id} />
                <input
                  type="hidden"
                  name="snapshotId"
                  value={snapshot.id}
                />
                <TopicFields position={nextTopicPosition} />
              </AdminForm>
            </details>
          </div>
        </AdminPanel>
      ) : (
        <div className="admin-inline-notice" role="note">
          Save a repository snapshot before adding topics.
        </div>
      )}

      <AdminPanel title="Danger zone" tone="danger">
        <p className="admin-danger-copy">
          Deleting this showcase entry also deletes its allowed hosts, snapshot,
          and topics. The linked authored project stays intact.
        </p>
        <AdminForm
          action={deleteGithubEntry}
          submitLabel="Delete GitHub entry"
          submitTone="danger"
          confirmText={`Delete the showcase entry for ${entry.repositoryFullName}?`}
          className="admin-delete-form"
        >
          <input type="hidden" name="id" value={entry.id} />
        </AdminForm>
      </AdminPanel>
    </>
  );
}

function HostFields({
  host,
  position = 1,
}: {
  host?: { position: number; host: string };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Allowed host"
        name="host"
        defaultValue={host?.host ?? ""}
        maxLength={255}
        placeholder="example.com"
        required
      />
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={host?.position ?? position}
        required
      />
    </div>
  );
}

function TopicFields({
  topic,
  position = 1,
}: {
  topic?: { position: number; name: string };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Topic"
        name="name"
        defaultValue={topic?.name ?? ""}
        maxLength={80}
        required
      />
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={topic?.position ?? position}
        required
      />
    </div>
  );
}
