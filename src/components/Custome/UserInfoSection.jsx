import { useState } from "react";
import styles from "./UserInfoSection.module.scss";

/**
 * UserInfoSection
 *
 * Collects required contact and size info:
 * - Ring size (text)
 * - Email
 * - Confirmation of silver-based materials
 *
 * @param {function} onUserInfoChange - callback to send state to parent
 * @returns {JSX.Element}
 */
function UserInfoSection({ onUserInfoChange }) {
  const [email, setEmail] = useState("");
  const [size, setSize] = useState("");
  const [confirm, setConfirm] = useState(false);

  const handleUpdate = (newValues) => {
    onUserInfoChange({
      email,
      size,
      confirmSilver: confirm,
      ...newValues,
    });
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    handleUpdate({ email: e.target.value });
  };

  const handleSizeChange = (e) => {
    setSize(e.target.value);
    handleUpdate({ size: e.target.value });
  };

  const handleConfirmChange = (e) => {
    setConfirm(e.target.checked);
    handleUpdate({ confirmSilver: e.target.checked });
  };

  return (
    <section className={styles.userInfoSection}>
      <div className={styles.sectionTitle}>
        <h2>Your Info</h2>
        <p>This helps us contact you and craft your size perfectly.</p>
      </div>

      <div className={styles.inputGroup}>
        <label>Ring or Jewelry Size</label>
        <input
          type="text"
          value={size}
          onChange={handleSizeChange}
          placeholder="e.g. 6.5 US / 52 EU"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="you@example.com"
        />
      </div>

      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          checked={confirm}
          onChange={handleConfirmChange}
          id="confirmSilver"
        />
        <label htmlFor="confirmSilver">
          I understand that all pieces are crafted in Silver 925. Bronze or gold may be used only as accents.
        </label>
      </div>
    </section>
  );
}

export default UserInfoSection;
