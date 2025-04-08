
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				admin: '#00B2BF',
        		staff: '#3498DB',  
       	 		user: '#F1AF00',
				active: '#33CC66',
				inactive: '#898989',
				block: '#CC0000',
				success: '#3498DB',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				metro: {
					red: '#E73C3E',
					blue: '#0067C0',
					green: '#00A651',
					purple: '#8B5CF6',
					yellow: '#FFD700',
					gray: '#8E9196'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			transformStyle: {
				'3d': 'preserve-3d',
				'flat': 'flat',
			},
			transformOrigin: {
				'center-left': 'center left',
				'center-right': 'center right',
			},
			backfaceVisibility: {
				'visible': 'visible',
				'hidden': 'hidden',
			},
			perspective: {
				'none': 'none',
				'500': '500px',
				'800': '800px',
				'1000': '1000px',
				'1200': '1200px',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'fade-out': {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'slide-up': {
					'0%': { transform: 'translateY(10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'slide-down': {
					'0%': { transform: 'translateY(-10px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'spin-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'flip-in-x': {
					'0%': { 
						opacity: '0',
						transform: 'perspective(800px) rotateX(-90deg)'
					},
					'100%': { 
						opacity: '1',
						transform: 'perspective(800px) rotateX(0)'
					}
				},
				'flip-in-y': {
					'0%': { 
						opacity: '0',
						transform: 'perspective(800px) rotateY(-90deg)'
					},
					'100%': { 
						opacity: '1',
						transform: 'perspective(800px) rotateY(0)'
					}
				},
				'rotate-3d': {
					'0%': {
						transform: 'perspective(800px) rotateX(0) rotateY(0)'
					},
					'50%': {
						transform: 'perspective(800px) rotateX(5deg) rotateY(5deg)'
					},
					'100%': {
						transform: 'perspective(800px) rotateX(0) rotateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'slide-up': 'slide-up 0.4s ease-out',
				'slide-down': 'slide-down 0.4s ease-out',
				'spin-slow': 'spin-slow 6s linear infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'float': 'float 5s ease-in-out infinite',
				'flip-in-x': 'flip-in-x 0.8s ease-out forwards',
				'flip-in-y': 'flip-in-y 0.8s ease-out forwards',
				'rotate-3d': 'rotate-3d 8s ease-in-out infinite',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
