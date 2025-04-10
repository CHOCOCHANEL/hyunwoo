export default defineNuxtPlugin(async (nuxtApp) => {
  if (!import.meta.env.SSR) {
    const { storeSettings } = useAppConfig();
    const { clearAllCookies, clearAllLocalStorage, getDomain } = useHelpers();
    const sessionToken = useCookie('woocommerce-session', { domain: getDomain(window.location.href) });

    // Wait for the user to interact with the page before refreshing the cart
    let initialised = false;
    const eventsToFireOn = ['mousedown', 'keydown', 'touchstart', 'scroll', 'wheel', 'click', 'resize', 'mousemove', 'mouseover'];

    async function initStore() {
      if (initialised) {
        eventsToFireOn.forEach((event) => {
          window.removeEventListener(event, initStore);
        });
        return;
      }

      initialised = true;

      const { refreshCart } = useCart();
      const success: boolean = await refreshCart();

      if (!success) {
        clearAllCookies();
        clearAllLocalStorage();

        // Add a new cookie to prevent infinite reloads
        const reloadCount = useCookie('reloadCount');
        if (!reloadCount) {
          useCookie('reloadCount', { default: () => '1' });
        } else {
          return;
        }

        // Log out the user
        const { logoutUser } = useAuth();
        await logoutUser();
      }
    }

    // Add event listeners
    eventsToFireOn.forEach((event) => {
      window.addEventListener(event, initStore);
    });
  }
});
