import styles from "@/assets/styles/layout/settingsLayout.module.scss";
import { ROUTE_PATH } from "@/utilities/enums";
import Link from "next/link";

const SettingsLayout = ({children}: any) => {
  return (
    <>
      <section className={styles['wrap-main']}>
        <aside className={styles['aside']}>
          <h3 className={styles['title-settings']}>Settings</h3>
          <Link href={ROUTE_PATH.editProfile}><div className={styles['item']}>Edit profile</div></Link>
          <Link href={ROUTE_PATH.changePassword}><div className={styles['item']}>Change password</div></Link>
        </aside>
        <main className={styles['wrap-content']}>
          {children}
        </main>
      </section>
    </>
  )
};

export default SettingsLayout;