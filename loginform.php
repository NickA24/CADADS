<?php 
$pagename = 'loginform';
$title = "Login - Diamond Dispatch";
include('./inc/header.php');
?>

<body>
	<div class="gradient"></div>
    <?php /*<div style="position:relative">
        <img class="background" alt="Background"/>
    </div> */ ?>
    <form  method="post" id="loginbox">
        <div class="login">
            <img class="logo" src="img/logo_v2_trans.png" alt="DD_Logo"/>
            <div class="shiftRight">
                <input type="hidden" name="userLogin" value="login">
                <input type="text" placeholder="Username" name="name" required>
                <input type="password" placeholder="Password" name="pwd" required>
                <button type="submit" class="btn btn-primary btn-block" id="loginbtn">Login</button>
                <button class="buttonload btn btn-primary btn-block" id="loggingIN"> 
                  <i class="fa fa-circle-o-notch fa-spin"></i>Logging in...
                </button>
                <div id="msgBox"></div>
            </div>
        </div>
    </form>
</body>
</html>
