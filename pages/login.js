import Login from '../components/login';
import Game from '../components/game';
import styles from "../styles/Home.module.css";

export default function LoginPage() {
  return (
    <div>
      <Login
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 1,
        }}
      />
      <main className={styles.main}>
        <p className={styles.description}>Competl</p>
        {/* <p className={styles.description}>A competitive word guessing game.</p> */}
        <Game />
      </main>
    </div>
  );
}