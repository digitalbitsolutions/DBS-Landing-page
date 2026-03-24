<?php
/**
 * Unzip Helper for Digital Bit Solutions
 * Subido automáticamente para descomprimir dist.zip sin necesidad de SSH.
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$zip_file = 'dist.zip';
$extract_to = './';

echo "<h1>Digital Bit Solutions - Unzip Helper</h1>";

if (!file_exists($zip_file)) {
    die("<p style='color:red;'>❌ Error: No se encuentra <b>$zip_file</b> en la carpeta raíz.</p>");
}

echo "<p>📦 Intentando descomprimir <b>$zip_file</b>...</p>";

$zip = new ZipArchive;
if ($zip->open($zip_file) === TRUE) {
    if ($zip->extractTo($extract_to)) {
        echo "<p style='color:green;'>✅ <b>¡Éxito!</b> Todos los archivos han sido extraídos correctamente.</p>";
        echo "<ul>";
        echo "<li>Servidor Node: <b>server.js</b> listo.</li>";
        echo "<li>Configuración Apache: <b>.htaccess</b> listo.</li>";
        echo "<li>Carpeta Next.js: <b>.next/</b> lista.</li>";
        echo "</ul>";
        echo "<p>⚠️ Ahora solo queda esperar a que soporte active Node.js para que el servidor pueda arrancar.</p>";
        
        // Opcional: auto-borrarse tras el éxito
        // unlink(__FILE__);
    } else {
        echo "<p style='color:red;'>❌ Error: No se pudo extraer el contenido del zip (posiblemente falta de permisos de escritura).</p>";
    }
    $zip->close();
} else {
    // Intento alternativo por comando del sistema si ZipArchive no está activo
    echo "<p>⚠️ ZipArchive no disponible. Intentando comando externo 'unzip'...</p>";
    $output = [];
    $retval = 0;
    exec("unzip -o $zip_file 2>&1", $output, $retval);
    
    if ($retval === 0) {
        echo "<p style='color:green;'>✅ <b>¡Éxito!</b> Descomprimido mediante sistema.</p>";
    } else {
        echo "<p style='color:red;'>❌ Error del sistema al descomprimir (Código: $retval): <br>" . implode("<br>", $output) . "</p>";
    }
}
?>
