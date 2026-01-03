<footer id="colophon" class="site-footer">
    <div class="footer-container">
        <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. Toate drepturile rezervate.</p>
        <p class="footer-note">Prețurile și disponibilitatea produselor sunt actualizate automat.</p>
    </div>
</footer>

<?php wp_footer(); ?>

<style>
.site-footer {
    background: #333;
    color: #fff;
    padding: 40px 0;
    margin-top: 60px;
    text-align: center;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.footer-container p {
    margin: 10px 0;
}

.footer-note {
    font-size: 14px;
    color: #999;
}
</style>

</body>
</html>
