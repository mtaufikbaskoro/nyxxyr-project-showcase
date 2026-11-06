import Link from "next/link";
import type { ProjectTheme } from "@prisma/client";
import { AdminForm } from "@/components/admin/admin-form";
import {
  AdminPanel,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/admin-ui";
import {
  createProject,
  deleteProject,
  deleteProjectEvidence,
  deleteProjectParagraph,
  deleteProjectQuote,
  deleteProjectSection,
  saveProjectEvidence,
  saveProjectParagraph,
  saveProjectQuote,
  saveProjectSection,
  updateProject,
} from "@/lib/admin/actions";
import type { getAdminProject } from "@/lib/admin/queries";
import { toDateTimeLocal } from "@/lib/admin/format";

type ProjectRecord = NonNullable<Awaited<ReturnType<typeof getAdminProject>>>;

type ProjectFormValue = {
  id?: string;
  slug: string;
  sortOrder: number;
  kicker: string;
  title: string;
  summary: string;
  lead: string;
  periodLabel: string | null;
  role: string | null;
  focus: string;
  readingTime: string;
  takeaway: string;
  theme: ProjectTheme;
  imageAlt: string;
  caption: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: Date | null;
};

export function ProjectForm({ project }: { project?: ProjectFormValue }) {
  const editing = Boolean(project?.id);

  return (
    <AdminPanel
      id="project-fields"
      title={editing ? "Story details" : "New project"}
      description="Core fields used by the project index and feature page."
    >
      <AdminForm
        action={editing ? updateProject : createProject}
        submitLabel={editing ? "Save project" : "Create project"}
      >
        {project?.id ? (
          <input type="hidden" name="id" value={project.id} />
        ) : null}
        <div className="admin-form-grid admin-form-grid--three">
          <TextField
            label="Title"
            name="title"
            defaultValue={project?.title ?? ""}
            maxLength={255}
            required
            className="admin-field--span-two"
          />
          <TextField
            label="Project order"
            name="sortOrder"
            type="number"
            min={1}
            defaultValue={project?.sortOrder ?? 1}
            required
          />
          <TextField
            label="Slug"
            name="slug"
            defaultValue={project?.slug ?? ""}
            maxLength={191}
            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
            hint="Public URL: /work/your-slug"
            required
            className="admin-field--span-two"
          />
          <TextField
            label="Kicker"
            name="kicker"
            defaultValue={project?.kicker ?? ""}
            maxLength={191}
            placeholder="Civic data / Project name"
            required
          />
          <TextAreaField
            label="Summary"
            name="summary"
            defaultValue={project?.summary ?? ""}
            rows={3}
            required
            className="admin-field--span-two"
          />
          <SelectField
            label="Theme"
            name="theme"
            defaultValue={project?.theme ?? "CIVIC"}
          >
            <option value="CIVIC">Civic</option>
            <option value="ENGINEERING">Engineering</option>
            <option value="EDUCATION">Education</option>
          </SelectField>
          <TextAreaField
            label="Lead"
            name="lead"
            defaultValue={project?.lead ?? ""}
            rows={5}
            required
            className="admin-field--span-three"
          />
          <TextField
            label="Period label"
            name="periodLabel"
            defaultValue={project?.periodLabel ?? ""}
            maxLength={120}
            placeholder="2024 - 2026"
          />
          <TextField
            label="Role"
            name="role"
            defaultValue={project?.role ?? ""}
            maxLength={191}
          />
          <TextField
            label="Reading time"
            name="readingTime"
            defaultValue={project?.readingTime ?? ""}
            maxLength={64}
            placeholder="4 min read"
            required
          />
          <TextField
            label="Focus"
            name="focus"
            defaultValue={project?.focus ?? ""}
            maxLength={255}
            required
          />
          <TextAreaField
            label="Takeaway"
            name="takeaway"
            defaultValue={project?.takeaway ?? ""}
            rows={3}
            required
            className="admin-field--span-two"
          />
          <TextField
            label="Image alternative text"
            name="imageAlt"
            defaultValue={project?.imageAlt ?? ""}
            required
            className="admin-field--span-two"
          />
          <TextField
            label="Caption"
            name="caption"
            defaultValue={project?.caption ?? ""}
            required
          />
          <SelectField
            label="Status"
            name="status"
            defaultValue={project?.status ?? "DRAFT"}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </SelectField>
          <TextField
            label="Publish date & time"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDateTimeLocal(project?.publishedAt)}
            hint="Blank means immediately available when published."
          />
        </div>
      </AdminForm>
    </AdminPanel>
  );
}

export function ProjectRelations({ project }: { project: ProjectRecord }) {
  const nextSectionPosition =
    Math.max(0, ...project.sections.map((section) => section.position)) + 1;

  return (
    <>
      <AdminPanel
        id="sections"
        title="Story sections"
        description={`${project.sections.length} ordered sections and their paragraphs.`}
        action={
          project.status === "PUBLISHED" ? (
            <Link className="text-link" href={`/work/${project.slug}`}>
              Preview <span aria-hidden="true">↗</span>
            </Link>
          ) : null
        }
      >
        <div className="admin-records">
          {project.sections.map((section) => (
            <details className="admin-section-record" key={section.id}>
              <summary>
                <span>{String(section.position).padStart(2, "0")}</span>
                <div>
                  <strong>{section.title}</strong>
                  <small>{section.paragraphs.length} paragraphs</small>
                </div>
                <i>Open</i>
              </summary>
              <div className="admin-section-record__body">
                <AdminForm action={saveProjectSection} submitLabel="Save section">
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="id" value={section.id} />
                  <SectionFields section={section} />
                </AdminForm>
                <AdminForm
                  action={deleteProjectSection}
                  submitLabel="Delete section"
                  submitTone="danger"
                  confirmText={`Delete "${section.title}" and all of its paragraphs?`}
                  className="admin-delete-form"
                >
                  <input type="hidden" name="projectId" value={project.id} />
                  <input type="hidden" name="id" value={section.id} />
                </AdminForm>

                <div className="admin-paragraphs">
                  <p className="admin-subhead">Paragraphs</p>
                  {section.paragraphs.map((paragraph) => (
                    <div className="admin-paragraph" key={paragraph.id}>
                      <AdminForm
                        action={saveProjectParagraph}
                        submitLabel="Save paragraph"
                      >
                        <input
                          type="hidden"
                          name="sectionId"
                          value={section.id}
                        />
                        <input type="hidden" name="id" value={paragraph.id} />
                        <ParagraphFields paragraph={paragraph} />
                      </AdminForm>
                      <AdminForm
                        action={deleteProjectParagraph}
                        submitLabel="Delete paragraph"
                        submitTone="danger"
                        confirmText="Delete this paragraph?"
                        className="admin-delete-form"
                      >
                        <input
                          type="hidden"
                          name="sectionId"
                          value={section.id}
                        />
                        <input type="hidden" name="id" value={paragraph.id} />
                      </AdminForm>
                    </div>
                  ))}
                  <details className="admin-add-record admin-add-record--nested">
                    <summary>
                      Add paragraph <span aria-hidden="true">+</span>
                    </summary>
                    <AdminForm
                      action={saveProjectParagraph}
                      submitLabel="Add paragraph"
                    >
                      <input
                        type="hidden"
                        name="sectionId"
                        value={section.id}
                      />
                      <ParagraphFields
                        position={Math.max(
                          0,
                          ...section.paragraphs.map(
                            (paragraph) => paragraph.position,
                          ),
                        ) + 1}
                      />
                    </AdminForm>
                  </details>
                </div>
              </div>
            </details>
          ))}

          <details
            className="admin-add-record"
            open={!project.sections.length}
          >
            <summary>
              Add story section <span aria-hidden="true">+</span>
            </summary>
            <AdminForm action={saveProjectSection} submitLabel="Add section">
              <input type="hidden" name="projectId" value={project.id} />
              <SectionFields position={nextSectionPosition} />
            </AdminForm>
          </details>
        </div>
      </AdminPanel>

      <div className="admin-editor-grid">
        <AdminPanel
          id="evidence"
          title="Evidence callout"
          description="One optional headline metric or factual value."
        >
          <AdminForm action={saveProjectEvidence} submitLabel="Save evidence">
            <input type="hidden" name="projectId" value={project.id} />
            <TextField
              label="Value"
              name="value"
              defaultValue={project.evidence?.value ?? ""}
              maxLength={191}
              placeholder="17"
              required
            />
            <TextAreaField
              label="Label"
              name="label"
              defaultValue={project.evidence?.label ?? ""}
              rows={3}
              required
            />
          </AdminForm>
          {project.evidence ? (
            <AdminForm
              action={deleteProjectEvidence}
              submitLabel="Remove evidence"
              submitTone="danger"
              confirmText="Remove this evidence callout?"
              className="admin-delete-form"
            >
              <input type="hidden" name="projectId" value={project.id} />
            </AdminForm>
          ) : null}
        </AdminPanel>

        <AdminPanel
          id="quote"
          title="Pull quote"
          description="One optional quote; leave attribution blank when anonymous."
        >
          <AdminForm action={saveProjectQuote} submitLabel="Save quote">
            <input type="hidden" name="projectId" value={project.id} />
            <TextAreaField
              label="Quote"
              name="body"
              defaultValue={project.quote?.body ?? ""}
              rows={5}
              required
            />
            <TextField
              label="Attribution"
              name="attribution"
              defaultValue={project.quote?.attribution ?? ""}
              maxLength={255}
            />
          </AdminForm>
          {project.quote ? (
            <AdminForm
              action={deleteProjectQuote}
              submitLabel="Remove quote"
              submitTone="danger"
              confirmText="Remove this pull quote?"
              className="admin-delete-form"
            >
              <input type="hidden" name="projectId" value={project.id} />
            </AdminForm>
          ) : null}
        </AdminPanel>
      </div>

      <AdminPanel title="Danger zone" tone="danger">
        <p className="admin-danger-copy">
          Deleting this project also deletes its sections, paragraphs,
          evidence, and quote. A linked GitHub showcase entry stays in place and
          becomes unlinked.
        </p>
        <AdminForm
          action={deleteProject}
          submitLabel="Delete project"
          submitTone="danger"
          confirmText={`Permanently delete "${project.title}"?`}
          className="admin-delete-form"
        >
          <input type="hidden" name="id" value={project.id} />
        </AdminForm>
      </AdminPanel>
    </>
  );
}

function SectionFields({
  section,
  position = 1,
}: {
  section?: { position: number; title: string };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Section title"
        name="title"
        defaultValue={section?.title ?? ""}
        maxLength={255}
        required
      />
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={section?.position ?? position}
        required
      />
    </div>
  );
}

function ParagraphFields({
  paragraph,
  position = 1,
}: {
  paragraph?: { position: number; body: string };
  position?: number;
}) {
  return (
    <div className="admin-form-grid admin-form-grid--two">
      <TextField
        label="Position"
        name="position"
        type="number"
        min={1}
        defaultValue={paragraph?.position ?? position}
        required
      />
      <TextAreaField
        label="Paragraph"
        name="body"
        defaultValue={paragraph?.body ?? ""}
        rows={4}
        required
        className="admin-field--wide"
      />
    </div>
  );
}
