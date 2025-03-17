<?php
include 'config.php';
session_start();

// Vérifier l'authentification
if (!isset($_SESSION['admin_logged_in'])) {
    header("Location: index.php");
    exit();
}

// Récupérer les commandes
$result = $conn->query("SELECT * FROM commandes ORDER BY date_commande DESC");
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin - Commandes</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <h2>Commandes Récentes</h2>
    <table>
        <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Adresse</th>
            <th>Date</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $row['nom_client'] ?></td>
            <td><?= $row['email'] ?></td>
            <td><?= $row['produit'] ?></td>
            <td><?= $row['quantite'] ?> kg</td>
            <td><?= $row['adresse'] ?></td>
            <td><?= date('d/m/Y H:i', strtotime($row['date_commande'])) ?></td>
        </tr>
        <?php endwhile; ?>
    </table>
</body>
</html>