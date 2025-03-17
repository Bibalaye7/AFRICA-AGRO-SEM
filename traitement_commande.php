<?php
include 'config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Nettoyer les entrées
    $nom = htmlspecialchars($_POST['nom']);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $produit = htmlspecialchars($_POST['produit']);
    $quantite = intval($_POST['quantite']);
    $adresse = htmlspecialchars($_POST['adresse']);

    // Préparer la requête
    $stmt = $conn->prepare("INSERT INTO commandes (nom_client, email, produit, quantite, adresse) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssis", $nom, $email, $produit, $quantite, $adresse);

    // Exécuter et gérer la réponse
    if ($stmt->execute()) {
        header("Location: index.php?success=1");
    } else {
        header("Location: index.php?error=1");
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: index.php");
}
?>