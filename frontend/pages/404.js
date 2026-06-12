import Link from "next/link";

export default function Custom404() {
  return (
    <div className="bg-purple">
      <div className="stars-404">
        <div className="custom-navbar-404">
          <div className="brand-logo-404">
            <strong>Ra&FeL</strong>
          </div>

          <div className="navbar-links-404">
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/admin">Admin</Link></li>
              <li><Link href="/carrinho">Carrinho</Link></li>
              <li><Link href="/" className="btn-request-404">Voltar</Link></li>
            </ul>
          </div>
        </div>

        <div className="central-body-404">
          <img
            className="image-404"
            src="http://salehriaz.com/404Page/img/404.svg"
            width="300"
            alt="404"
          />

          <Link href="/" className="btn-go-home-404">
            VOLTAR PARA LOJA
          </Link>
        </div>

        <div className="objects-404">
          <img
            className="object_rocket"
            src="http://salehriaz.com/404Page/img/rocket.svg"
            width="40"
            alt="Foguete"
          />

          <div className="earth-moon">
            <img
              className="object_earth"
              src="http://salehriaz.com/404Page/img/earth.svg"
              width="100"
              alt="Terra"
            />

            <img
              className="object_moon"
              src="http://salehriaz.com/404Page/img/moon.svg"
              width="80"
              alt="Lua"
            />
          </div>

          <div className="box_astronaut">
            <img
              className="object_astronaut"
              src="http://salehriaz.com/404Page/img/astronaut.svg"
              width="140"
              alt="Astronauta"
            />
          </div>
        </div>

        <div className="glowing_stars">
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
          <div className="star"></div>
        </div>
      </div>
    </div>
  );
}