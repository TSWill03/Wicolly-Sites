<?php
/**
 * Plugin Name: BlackLight 3D Catalog Mode
 * Description: Keeps WooCommerce in quote/catalog mode and adds WhatsApp quote links.
 */

if (!defined('ABSPATH')) {
    exit;
}

function blacklight3d_quote_phone(): string
{
    $phone = getenv('BLACKLIGHT_WHATSAPP_NUMBER') ?: '5564993252339';

    return preg_replace('/\D+/', '', $phone);
}

function blacklight3d_quote_message($product = null): string
{
    $message = 'Olá! Vim pelo catálogo da BlackLight 3D e gostaria de pedir um orçamento para esta peça.';

    if ($product instanceof WC_Product) {
        $message .= "\n\nProduto: " . $product->get_name();
        $message .= "\nLink: " . get_permalink($product->get_id());
    }

    return $message;
}

function blacklight3d_whatsapp_url($product = null): string
{
    return sprintf(
        'https://wa.me/%s?text=%s',
        blacklight3d_quote_phone(),
        rawurlencode(blacklight3d_quote_message($product))
    );
}

function blacklight3d_render_quote_button(): void
{
    if (!function_exists('wc_get_product')) {
        return;
    }

    $product = wc_get_product(get_the_ID());

    if (!$product instanceof WC_Product) {
        return;
    }

    printf(
        '<a class="button blacklight3d-whatsapp-quote" href="%s" target="_blank" rel="noopener noreferrer">Pedir orçamento pelo WhatsApp</a>',
        esc_url(blacklight3d_whatsapp_url($product))
    );
}

function blacklight3d_register_catalog_mode(): void
{
    add_filter('woocommerce_is_purchasable', '__return_false');
    remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30);
    remove_action('woocommerce_after_shop_loop_item', 'woocommerce_template_loop_add_to_cart', 10);
    add_action('woocommerce_single_product_summary', 'blacklight3d_render_quote_button', 30);
    add_action('woocommerce_after_shop_loop_item', 'blacklight3d_render_quote_button', 10);
}

add_action('plugins_loaded', 'blacklight3d_register_catalog_mode', 20);
