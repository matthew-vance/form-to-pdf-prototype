function App() {
  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <header>
        <h1 className="text-4xl">Header</h1>
      </header>
      <main className="flex">
        <section className="w-1/2">
          <h1>Form side</h1>
        </section>
        <section className="w-1/2">
          <h1>Preview side</h1>
        </section>
      </main>
    </div>
  );
}

export default App;
