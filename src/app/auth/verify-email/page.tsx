import VerifyEmailForm from "./Form";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  // Fetch email from the query params using `searchParams`
  const email = searchParams.email || "";

  // Any other server-side data fetching can be done here

  return (
    <div>
      {/* Pass the email as a prop to the client component */}
      <VerifyEmailForm email={email} />
    </div>
  );
}
