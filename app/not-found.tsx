import { ButtonLink, Kicker } from "@/components/editorial";

export default function NotFound() {
  return (
    <main id="main-content" className="page-shell not-found">
      <div className="not-found__copy">
        <Kicker accent>Stop the presses / 404</Kicker>
        <h1>This story missed the edition.</h1>
        <p>
          The page may have moved, or the address may not have made it past the
          copy desk. The front page is still intact.
        </p>
        <ButtonLink href="/">Return to the front page</ButtonLink>
      </div>
      <p className="not-found__folio" aria-hidden="true">
        404
      </p>
    </main>
  );
}
