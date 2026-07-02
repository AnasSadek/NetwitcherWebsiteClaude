<?php
/**
 * Header: Sticky-Navigation mit Logo-Stern, Dropdown & Mobile-Menü.
 *
 * @package Netwitcher
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main">Zum Inhalt springen</a>

<header class="nw-header" id="nw-header">
	<div class="nw-container nw-header-inner">
		<a class="nw-brand" href="<?php echo esc_url( home_url( '/' ) ); ?>" aria-label="Netwitcher – Startseite">
			<?php nw_star_svg( 38 ); ?>
			<span>NETWITCHER</span>
		</a>

		<nav class="nw-nav" aria-label="Hauptnavigation">
			<?php
			wp_nav_menu(
				array(
					'theme_location' => 'primary',
					'container'      => false,
					'menu_class'     => '',
					'fallback_cb'    => 'nw_nav_fallback',
					'depth'          => 2,
				)
			);
			?>
		</nav>

		<div style="display:flex;align-items:center;gap:12px;">
			<a class="nw-btn nw-btn--primary nw-header-cta" href="<?php echo esc_url( home_url( '/kontakt/' ) ); ?>">Kostenloses Erstgespräch</a>
			<button class="nw-burger" type="button" aria-expanded="false" aria-controls="nw-mobilenav" aria-label="Menü öffnen" id="nw-burger">
				<span></span><span></span>
			</button>
		</div>
	</div>

	<nav class="nw-mobilenav" id="nw-mobilenav" aria-label="Mobile Navigation">
		<?php
		wp_nav_menu(
			array(
				'theme_location' => 'primary',
				'container'      => false,
				'menu_class'     => '',
				'fallback_cb'    => 'nw_nav_fallback',
				'depth'          => 2,
			)
		);
		?>
		<a class="nw-btn nw-btn--primary" href="<?php echo esc_url( home_url( '/kontakt/' ) ); ?>">Kostenloses Erstgespräch</a>
	</nav>
</header>

<main id="main">
