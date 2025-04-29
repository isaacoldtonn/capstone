"use client"

import { useRef, useState } from "react";
import styles from "../AdminDashboard.module.css";
import useUserStore from "@/stores/useUserStore";
import { useRouter } from "next/navigation";

export default function BadgesManagement() {
  const [badges, setBadges] = useState<any>([]);
  const [newBadge, setNewBadge] = useState({ name: "", xp: "", image: "" });
  const [editingId, setEditingId] = useState(null);
  const [editXP, setEditXP] = useState("");
  const fileInputRef = useRef(null);
  const router = useRouter();
  const { user } = useUserStore();
  if (user!.role !== "admin") return router.push("/dashboard")

  const handleUpload = () => {
    if (!newBadge.name || !newBadge.xp || !newBadge.image) return;
    setBadges([
      ...badges,
      {
        id: badges.length + 1,
        name: newBadge.name,
        xp: Number(newBadge.xp),
        image: newBadge.image,
      },
    ]);
    setNewBadge({ name: "", xp: "", image: "" });
  };

  const handleImageDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBadge({ ...newBadge, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewBadge({ ...newBadge, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePreviewImage = () => {
    setNewBadge({ ...newBadge, image: "" });
  };

  const handleEdit = (id: any) => {
    const updated = badges.map((badge: any) =>
      badge.id === id ? { ...badge, xp: Number(editXP) } : badge
    );
    setBadges(updated);
    setEditingId(null);
    setEditXP("");
  };

  const handleDelete = (id: any) => {
    setBadges(badges.filter((badge: any) => badge.id !== id));
  };

  return (
    <div className={styles.badgesContainer}>
      <h2 className={styles.sectionTitle}>Badges</h2>

      <div className={styles.badgeUploadForm}>
        <input
          type="text"
          placeholder="Name"
          value={newBadge.name}
          onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="XP"
          value={newBadge.xp}
          onChange={(e) => setNewBadge({ ...newBadge, xp: e.target.value })}
        />

        <div
          className={styles.dropZone}
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          {newBadge.image ? (
            <div className={styles.imagePreviewWrapper}>
              <img src={newBadge.image} alt="Preview" className={styles.previewImage} />
              <button
                type="button"
                className={styles.removeImageButton}
                onClick={(e) => {
                  e.stopPropagation();
                  removePreviewImage();
                }}
              >
                ×
              </button>
            </div>
          ) : (
            <p>Drag & drop an image or click to upload</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
        </div>

        <button onClick={handleUpload}>Upload</button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>XP Breakpoint</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {badges.map((badge: any) => (
            <tr key={badge.id}>
              <td>{badge.name}</td>
              <td>
                <img src={badge.image} alt={badge.name} className={styles.previewImage} />
              </td>
              <td>
                {editingId === badge.id ? (
                  <input
                    type="number"
                    value={editXP}
                    onChange={(e) => setEditXP(e.target.value)}
                    className={styles.inlineInput}
                  />
                ) : (
                  `${badge.xp} XP`
                )}
              </td>
              <td>
                {editingId === badge.id ? (
                  <button onClick={() => handleEdit(badge.id)}>Save</button>
                ) : (
                  <button onClick={() => {
                    setEditingId(badge.id);
                    setEditXP(badge.xp.toString());
                  }}>Edit</button>
                )}
                <button onClick={() => handleDelete(badge.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
