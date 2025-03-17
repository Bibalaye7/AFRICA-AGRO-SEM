<?php include 'config.php'; ?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Africa Agro Sem - Accueil</title>
    <link rel="stylesheet" href="assets/style.css">
</head>
<body>
    <header class="header">
        <h1>AFRICA AGRO SEM</h1>
        <p>L'excellence agricole depuis 2023</p>
    </header>

    <nav class="nav">
        <a href="index.php">Accueil</a>
        <a href="about.php">À propos</a>
    </nav>

    <!-- ... (contenu existant identique) ... -->

    <section class="order-section">
        <h2>Commander nos produits</h2>
        <form action="traitement_commande.php" method="POST">
            <input type="text" name="nom" placeholder="Nom complet" required>
            <input type="email" name="email" placeholder="Email" required>
            <select name="produit" required>
                <option value="">Choisir un produit</option>
                <option value="Céréales Bio">Céréales Bio</option>
                <option value="Légumineuses">Légumineuses</option>
                <option value="Fruits Frais">Fruits Frais</option>
            </select>
            <input type="number" name="quantite" placeholder="Quantité (kg)" min="1" required>
            <textarea name="adresse" placeholder="Adresse de livraison" required></textarea>
            <button type="submit">Valider la commande</button>
        </form>
    </section>

    <?php include 'footer.php'; ?>
</body>
</html>