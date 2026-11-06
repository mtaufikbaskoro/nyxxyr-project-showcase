import type { ReactNode } from "react";
import { Suspense } from "react";
import { BackgroundKind, GithubAccountType } from "@prisma/client";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminPageHeader,
  AdminPanel,
  EmptyState,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-ui";
import {
  deleteBackgroundItem,
  deleteCredential,
  deleteSkill,
  saveBackgroundItem,
  saveCredential,
  saveSkill,
  updateProfile,
} from "@/lib/admin/actions";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminProfile } from "@/lib/admin/queries";

export const metadata = {
  title: "Profile & CV",
};

export default function AdminProfilePage() {
  return (
    <Suspense fallback={<AdminPageFallback />}>
      <AdminProfile />
    </Suspense>
  );
}

async function AdminProfile() {
  await requireAdmin();
  const profile = await getAdminProfile();

  if (!profile) {
    return (
      <div className="admin-page">
        <AdminPageHeader
          eyebrow="Identity and background"
          title="Profile & CV"
          description="The profile record is the root of the public portfolio."
        />
        <AdminPanel title="Profile not initialized">
          <EmptyState
            title="Seed the profile first"
            description="Run the project seed once to create the canonical portfolio profile, then return here to edit it."
          />
        </AdminPanel>
      </div>
    );
  }

  const nextBackgroundPosition =
    Math.max(0, ...profile.backgroundItems.map((item) => item.position)) + 1;
  const nextCredentialPosition =
    Math.max(0, ...profile.credentials.map((item) => item.position)) + 1;
  const nextSkillPosition =
    Math.max(0, ...profile.skills.map((item) => item.position)) + 1;

  return (
    <div className="admin-page">
      <AdminPageHeader
        eyebrow="Identity and background"
        title="Profile & CV"
        description="Edit the public identity, contact details, ordered background items, credentials, and skills."
      />

      <AdminPanel
        id="identity"
        title="Public identity"
        description="Changes appear across the masthead, metadata, and contact areas."
      >
        <AdminForm action={updateProfile} submitLabel="Save profile">
          <input type="hidden" name="id" value={profile.id} />
          <div className="admin-form-grid admin-form-grid--two">
            <TextField
              label="Name"
              name="name"
              defaultValue={profile.name}
              maxLength={120}
              required
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              defaultValue={profile.email}
              maxLength={254}
              required
            />
            <TextField
              label="Summary"
              name="summary"
              defaultValue={profile.summary}
              maxLength={255}
              required
              className="admin-field--wide"
              hint="Keep this to one concise public-facing sentence."
            />
            <TextField
              label="LinkedIn URL"
              name="linkedInUrl"
              type="url"
              defaultValue={profile.linkedInUrl}
              required
            />
            <TextField
              label="GitHub URL"
              name="githubUrl"
              type="url"
              defaultValue={profile.githubUrl}
              required
            />
            <TextField
              label="GitHub account"
              name="githubAccount"
              defaultValue={profile.githubAccount ?? ""}
              maxLength={39}
              hint="Username or organization handle, without the full URL."
            />
            <SelectField
              label="GitHub account type"
              name="githubAccountType"
              defaultValue={profile.githubAccountType}
            >
              {Object.values(GithubAccountType).map((value) => (
                <option value={value} key={value}>
                  {value === "USER" ? "User" : "Organization"}
                </option>
              ))}
            </SelectField>
            <TextAreaField
              label="Availability"
              name="availability"
              defaultValue={profile.availability ?? ""}
              rows={3}
              className="admin-field--wide"
            />
          </div>
        </AdminForm>
      </AdminPanel>

      <CollectionPanel
        id="background"
        eyebrow="Ordered collection"
        title="Background"
        description="Experience and education cards shown in the public background section."
      >
        {profile.backgroundItems.length ? (
          profile.backgroundItems.map((item) => (
            <details className="admin-record" key={item.id}>
              <summary>
                <span>{String(item.position).padStart(2, "0")}</span>
                <div>
                  <strong>{item.title}</strong>
                  <small>
                    {item.organization} / {item.kind}
                  </small>
                </div>
                <i>Edit</i>
              </summary>
              <AdminForm
                action={saveBackgroundItem}
                submitLabel="Save background item"
              >
                <input type="hidden" name="id" value={item.id} />
                <BackgroundFields item={item} />
              </AdminForm>
              <AdminForm
                action={deleteBackgroundItem}
                submitLabel="Delete"
                submitTone="danger"
                confirmText={`Delete "${item.title}"?`}
                className="admin-delete-form"
              >
                <input type="hidden" name="id" value={item.id} />
              </AdminForm>
            </details>
          ))
        ) : (
          <EmptyState
            title="No background items"
            description="Add experience or education to populate the public CV section."
          />
        )}
        <details
          className="admin-add-record"
          open={!profile.backgroundItems.length}
        >
          <summary>
            Add background item <span aria-hidden="true">+</span>
          </summary>
          <AdminForm
            action={saveBackgroundItem}
            submitLabel="Add background item"
          >
            <BackgroundFields position={nextBackgroundPosition} />
          </AdminForm>
        </details>
      </CollectionPanel>

      <CollectionPanel
        id="credentials"
        eyebrow="Ordered collection"
        title="Credentials"
        description="Certifications and training attached to education content."
      >
        {profile.credentials.length ? (
          profile.credentials.map((item) => (
            <details className="admin-record" key={item.id}>
              <summary>
                <span>{String(item.position).padStart(2, "0")}</span>
                <div>
                  <strong>{item.name}</strong>
                  <small>
                    {item.issuer}
                    {item.score ? ` / ${item.score}` : ""}
                  </small>
                </div>
                <i>Edit</i>
              </summary>
              <AdminForm action={saveCredential} submitLabel="Save credential">
                <input type="hidden" name="id" value={item.id} />
                <CredentialFields item={item} />
              </AdminForm>
              <AdminForm
                action={deleteCredential}
                submitLabel="Delete"
                submitTone="danger"
                confirmText={`Delete "${item.name}"?`}
                className="admin-delete-form"
              >
                <input type="hidden" name="id" value={item.id} />
              </AdminForm>
            </details>
          ))
        ) : (
          <EmptyState
            title="No credentials"
            description="Add certifications or training records."
          />
        )}
        <details className="admin-add-record" open={!profile.credentials.length}>
          <summary>
            Add credential <span aria-hidden="true">+</span>
          </summary>
          <AdminForm action={saveCredential} submitLabel="Add credential">
            <CredentialFields position={nextCredentialPosition} />
          </AdminForm>
        </details>
      </CollectionPanel>

      <CollectionPanel
        id="skills"
        eyebrow="Ordered collection"
        title="Skills"
        description="Compact skills shown alongside the background."
      >
        <div className="admin-skill-list">
          {profile.skills.map((skill) => (
            <details className="admin-skill" key={skill.id}>
              <summary>
                <span>{String(skill.position).padStart(2, "0")}</span>
                <strong>{skill.name}</strong>
                <i>Edit</i>
              </summary>
              <AdminForm action={saveSkill} submitLabel="Save skill">
                <input type="hidden" name="id" value={skill.id} />
                <SkillFields item={skill} />
              </AdminForm>
              <AdminForm
                action={deleteSkill}
                submitLabel="Delete"
                submitTone="danger"
                confirmText={`Delete "${skill.name}"?`}
                className="admin-delete-form"
              >
                <input type="hidden" name="id" value={skill.id} />
              </AdminForm>
            </details>
          ))}
        </div>
        <details className="admin-add-record" open={!profile.skills.length}>
          <summary>
            Add skill <span aria-hidden="true">+</span>
          </summary>
          <AdminForm action={saveSkill} submitLabel="Add skill">
            <SkillFields position={nextSkillPosition} />
          </AdminForm>
        </details>
      </CollectionPanel>
    </div>
  );
}

function CollectionPanel({
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <AdminPanel
      id={id}
      title={title}
      description={`${eyebrow} / ${description}`}
    >
      <div className="admin-records">{children}</div>
    </AdminPanel>
  );
}

function BackgroundFields({
  item,
  position = 1,
}: {
  item?: {
    kind: BackgroundKind;
    position: number;
    title: string;
    organization: string;
    periodLabel: string | null;
    body: string;
  };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <SelectField
        label="Type"
        name="kind"
        defaultValue={item?.kind ?? BackgroundKind.EXPERIENCE}
      >
        <option value={BackgroundKind.EXPERIENCE}>Experience</option>
        <option value={BackgroundKind.EDUCATION}>Education</option>
      </SelectField>
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={item?.position ?? position}
        required
      />
      <TextField
        label="Title"
        name="title"
        defaultValue={item?.title ?? ""}
        maxLength={255}
        required
      />
      <TextField
        label="Organization"
        name="organization"
        defaultValue={item?.organization ?? ""}
        maxLength={255}
        required
      />
      <TextField
        label="Period label"
        name="periodLabel"
        defaultValue={item?.periodLabel ?? ""}
        maxLength={120}
        placeholder="July 2024 - Present"
      />
      <TextAreaField
        label="Description"
        name="body"
        defaultValue={item?.body ?? ""}
        rows={5}
        required
        className="admin-field--wide"
      />
    </div>
  );
}

function CredentialFields({
  item,
  position = 1,
}: {
  item?: {
    position: number;
    name: string;
    issuer: string;
    validThrough: Date | null;
    score: string | null;
    description: string;
  };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Credential name"
        name="name"
        defaultValue={item?.name ?? ""}
        maxLength={255}
        required
      />
      <TextField
        label="Issuer"
        name="issuer"
        defaultValue={item?.issuer ?? ""}
        maxLength={255}
        required
      />
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={item?.position ?? position}
        required
      />
      <TextField
        label="Valid through"
        name="validThrough"
        type="date"
        defaultValue={item?.validThrough?.toISOString().slice(0, 10) ?? ""}
      />
      <TextField
        label="Score"
        name="score"
        defaultValue={item?.score ?? ""}
        maxLength={32}
        placeholder="91.75/100"
      />
      <TextAreaField
        label="Description"
        name="description"
        defaultValue={item?.description ?? ""}
        rows={4}
        required
        className="admin-field--wide"
      />
    </div>
  );
}

function SkillFields({
  item,
  position = 1,
}: {
  item?: { position: number; name: string };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Skill name"
        name="name"
        defaultValue={item?.name ?? ""}
        maxLength={120}
        required
      />
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={item?.position ?? position}
        required
      />
    </div>
  );
}

function AdminPageFallback() {
  return (
    <div className="admin-page-fallback" role="status">
      <span className="loading-mark" aria-hidden="true" />
      <p>Loading profile...</p>
    </div>
  );
}
