# ASSET_MANIFEST.md

## 1) Estilo y tamaño (Single Source of Truth)
- Estilo: <pixel-minimal | flat-minimal | otro>
- Tamaño sprite: <32x32 | 64x64 | 128x128>
- Paleta: <nota opcional>

## 2) Assets MVP (Requeridos para la demo)
| Categoría | Asset | Path | Notas |
|---|---|---|---|
| Player | player | src/assets/sprites/player.png | placeholder ok |
| Enemy | enemy_basic | src/assets/sprites/enemy_basic.png | placeholder ok |
| Background | bg_main | src/assets/sprites/bg_main.png | simple ok |
| UI | icon_health | src/assets/ui/icon_health.png | |
| UI | icon_pause | src/assets/ui/icon_pause.png | opcional |

## 3) Assets Nice-to-have (solo si queda tiempo)
| Categoría | Asset | Path | Notas |
|---|---|---|---|
| Enemy | enemy_adaptive | src/assets/sprites/enemy_adaptive.png | cue visual de AI |
| FX | hit_fx | src/assets/sprites/hit_fx.png | |
| Audio | sfx_hit | src/assets/audio/sfx_hit.mp3 | |

## 4) Criterio de “Done”
- [ ] Todos los paths del MVP existen
- [ ] El juego corre sin assets faltantes
- [ ] Player/enemy/UI son legibles
