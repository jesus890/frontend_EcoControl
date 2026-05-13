export default function ErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col gap-4">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="text-muted-foreground">
        La página no existe
      </p>
    </div>
  );
}