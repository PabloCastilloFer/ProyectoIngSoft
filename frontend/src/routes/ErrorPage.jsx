import { useRouteError } from 'react-router-dom';
import '../styles/notFound.css'; // Asegúrate de que la ruta sea correcta

const ErrorPage = () => {
  const error = useRouteError();

  /**
   * Este mensaje de error, está pensado para los desarrolladores.
   * En un entorno de producción, no se debería mostrar este mensaje o almenos
   * no de esta forma.
   */
  console.error({
    status: error.status,
    statusText: error.statusText,
    message: error.message ? error.message : 'No message',
  });

  return (
    <div className="containerError flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="flex justify-center">
          <img
            src="/dildudo.png"
            width={400}
            height={400}
            alt="404 Error"
            className="dildudo"
          />
        </div>
        <div>
          <p className='DildudoNotDead text-muted-foreground'>(No está muerto)</p>
        </div>
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
          Oops, página no encontrada
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
        Lo sentimos, pero la página que buscas no existe. Regresa a la página principal para seguir explorando.
        </p>
        <div className='container-didudo'>
          <p className="didudo-text mt-4 text-muted-foreground">
            Para que tu código funcione siempre contacta con -
          <a
            href="https://github.com/didudocl/"
            className='didudo-text'
            >
            Didudo
          </a>
          </p>
        </div>

        <div className="mt-6">
          <a
            href="/home"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Volver a la página principal
          </a>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
