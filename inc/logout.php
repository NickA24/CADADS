<?php
//This simply clears all session data and returns the user to the previous page.
session_start();
session_destroy();
header('Location: '.$_SERVER['HTTP_REFERER']);
?>

