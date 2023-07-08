/**
 * This is a minimal config.
 *
 * If you need the full config, get it from here:
 * https://unpkg.com/browse/tailwindcss@latest/stubs/defaultConfig.stub.js
 */

module.exports = {
    content: [
        /**
         * HTML. Paths to Django template files that will contain Tailwind CSS classes.
         */

        /*  Templates within theme app (<tailwind_app_name>/templates), e.g. base.html. */
        '../templates/**/*.html',

        /*
         * Main templates directory of the project (BASE_DIR/templates).
         * Adjust the following line to match your project structure.
         */
        '../../templates/**/*.html',

        /*
         * Templates in other django apps (BASE_DIR/<any_app_name>/templates).
         * Adjust the following line to match your project structure.
         */
        '../../**/templates/**/*.html',

        /**
         * JS: If you use Tailwind CSS in JavaScript, uncomment the following lines and make sure
         * patterns match your project structure.
         */
        /* JS 1: Ignore any JavaScript in node_modules folder. */
        // '!../../**/node_modules',
        /* JS 2: Process all JavaScript files in the project. */
        // '../../**/*.js',

        /**
         * Python: If you use Tailwind CSS classes in Python, uncomment the following line
         * and make sure the pattern below matches your project structure.
         */
        // '../../**/*.py'
    ],
    theme: {
        extend: {
            colors: {
                current: 'currentColor',
                transparent : 'transparent',
                'black': '#000000',
                'background': '#0f111b',
                'grey': '#818596',
                'grey-2': '#c1c3cc',
                'dark-purple': '#30365F',
                'dark-purple-2': '#686f9a',
                'purple': '#7a5ccc',
                'light-purple': '#b3a1e6',
                'cyan': '#00a3cc',
                'green': '#5ccc96',
                'yellow': '#f2ce00',
                'orange': '#e39400',
                'magenta': '#ce6f8f',
                'red': '#e33400',
                'foreground': '#ecf0c1',
                'white': '#ffffff',
            },
            animation: {
                loader: 'loader 0.6s infinite alternate'
            },
            keyframes: {
                loader: {
                    to: {
                        opacity: 0.5,
                        transform: 'translate3d(0, -.25rem, 0)'
                    }
                }
            }
        }
    },
    plugins: [
        /**
         * '@tailwindcss/forms' is the forms plugin that provides a minimal styling
         * for forms. If you don't like it or have own styling for forms,
         * comment the line below to disable '@tailwindcss/forms'.
         */
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
    ],
}
