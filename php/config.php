<?php
$host = "localhost";
$user = "root"; // À modifier selon votre configuration
$password = "";
$dbname = "africa_agro_sem";

// Créer la connexion
$conn = new mysqli($host, $user, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Erreur de connexion : " . $conn->connect_error);
}

// Définir le charset
$conn->set_charset("utf8");
?>