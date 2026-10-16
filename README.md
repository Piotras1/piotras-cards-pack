## All available Piotras cards

# 🔘 Piotras Smart Button
<img src="https://raw.githubusercontent.com/Piotras1/piotras-smart-button/refs/heads/main/img/Neonowy%20baner%20Piotras%20Smart%20Button.jpg" alt="Piotras Smart Button">

### Description
- **One all-in-one Lovelace card for Home Assistant — lights, media players, climate, covers, vacuums, alarms, weather, clock, calendar and more. Set it up in the visual editor, no YAML needed.**
- **Sliders, icons and colors adapt to the entity automatically. Add custom state labels, conditions and blockades with a few lines of YAML.**
- **For power users: `custom_data` (your own JavaScript) and `custom_tap` (clickable elements with their own actions) — keypads, charts and control panels in a single card, no main entity needed.**
---
<details>
<summary><b>🧩 custom_data and custom_tap syntax</b></summary>

### Custom Data syntax
```yaml
type: custom:piotras-smart-button
custom_data:
  temperature: |-
    p{{{
      const t = states['sensor.living_room_temperature']?.state;
      return t !== undefined ? `${t} °C` : '—';
    }}}q
name: customData.temperature
```
The `p{{{ … }}}q` block must be the whole value of the key and must contain a `return`. Use the result in most fields as `customData.<key>`.

### Custom Tap syntax
```yaml
type: custom:piotras-smart-button
custom_data:
  panel: |-
    p{{{
      const tap = customTap.id({
        action: 'call-service',
        service: 'light.toggle',
        service_data: { entity_id: 'light.living_room' }
      });
      return `<div ${tap} style="cursor: pointer;">Toggle light</div>`;
    }}}q
name: customData.panel
```
`customTap.id({...})` gives one generated element its own action. For your own JavaScript use `customTap.id_js({ action: () => { ... card._updateState(); } })`.

Full guides: [Custom Data & Templates](https://github.com/Piotras1/piotras-smart-button/blob/main/docs/custom_data_guide_3.md) · [Custom Tap](https://github.com/Piotras1/piotras-smart-button/blob/main/docs/custom_tap_3.md) · [Writing code with AI](https://github.com/Piotras1/piotras-smart-button/blob/main/docs/ai_helper_3.md)

</details>

---

![HACS](https://img.shields.io/badge/HACS-Default-orange?style=flat-square)
[![HACS Downloads](https://img.shields.io/github/downloads/Piotras1/piotras-smart-button/piotras-smart-button-loader.js?logo=homeassistant&color=41BDF5&displayAssetName=false)](https://github.com/Piotras1/piotras-smart-button)
[![GitHub Stars](https://img.shields.io/github/stars/Piotras1/piotras-smart-button?style=flat-square&logo=github&label=stars&color=brightgreen)](https://github.com/Piotras1/piotras-smart-button/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/Piotras1/piotras-smart-button?style=flat-square&logo=github&label=issues)](https://github.com/Piotras1/piotras-smart-button/issues)
[![GitHub Release](https://img.shields.io/github/v/release/Piotras1/piotras-smart-button?style=flat-square&logo=github&label=released)](https://github.com/Piotras1/piotras-smart-button/releases)
![GitHub Forks](https://img.shields.io/github/forks/Piotras1/piotras-smart-button?style=flat-square&logo=github&label=forks&color=blue)

[![Guides](https://img.shields.io/badge/Guides-Show%20%26%20Tell-olive?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-smart-button/discussions/categories/show-and-tell)
[![Guides](https://img.shields.io/badge/Guides-Custom%20Data%20Modules-teal?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-smart-button/discussions/categories/custom-data-modules)
[![GitHub Discussions](https://img.shields.io/badge/Discussions-Join%20the%20community-blueviolet?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-smart-button/discussions)
[![GitHub Discussions](https://img.shields.io/github/discussions/Piotras1/piotras-smart-button?style=flat-square&logo=github&label=discussions&color=blueviolet)](https://github.com/Piotras1/piotras-smart-button/discussions)

[![Assets Gallery](https://img.shields.io/badge/Assets%20Gallery-Smart%20Button-00b4d8?style=flat-square&logo=materialdesign)](https://piotras1.github.io/piotras-cards-pack/smart-button-assets.html)
[![MDI Icons](https://img.shields.io/badge/HA%20Icons-Search%20Gallery-00b4d8?style=flat-square&logo=materialdesign)](https://piotras1.github.io/piotras-cards-pack/mdi-icon-browser.html)

| Documentation | Installation |
| :--- | :--- |
| [![Documentation](https://img.shields.io/badge/Documentation-View%20Guide-blue?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Piotras1/piotras-smart-button) | [![HACS Installation](https://img.shields.io/badge/HACS-Install%20Repo-orange?style=for-the-badge&logo=home-assistant&logoColor=white)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Piotras1&repository=piotras-smart-button&category=plugin) |
> [!TIP]
> **Manual Installation:** Full step-by-step instructions are available in the **Documentation** link above.

---

# 🌡️ Piotras Climate Info
<img width="1200" height="799" alt="piotras-climate-info" src="https://github.com/user-attachments/assets/854fd68b-4f35-42d1-9efe-69e8e36d2afa" />
<br><br>

![HACS](https://img.shields.io/badge/HACS-Default-orange?style=flat-square)
![HACS Downloads](https://img.shields.io/github/downloads/Piotras1/piotras-climate-info/piotras-climate-info-loader.js?logo=homeassistant&color=41BDF5&displayAssetName=false)
![GitHub Stars](https://img.shields.io/github/stars/Piotras1/piotras-climate-info?style=flat-square&logo=github&label=stars&color=brightgreen)
![GitHub Issues](https://img.shields.io/github/issues/Piotras1/piotras-climate-info?style=flat-square&logo=github&label=issues)
[![GitHub Release](https://img.shields.io/github/v/release/Piotras1/piotras-climate-info?style=flat-square&logo=github&label=released)](https://github.com/Piotras1/piotras-climate-info/releases)
![GitHub Release Date](https://img.shields.io/github/release-date/Piotras1/piotras-climate-info?style=flat-square&logo=github&label=released)

[![GitHub Discussions](https://img.shields.io/badge/Discussions-Join%20the%20community-blueviolet?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-climate-info/discussions)
![GitHub Discussions](https://img.shields.io/github/discussions/Piotras1/piotras-climate-info?style=flat-square&logo=github&label=discussions&color=blueviolet)

[![Tile CSS Builder](https://img.shields.io/badge/Tile%20CSS%20Builder-Online%20Tool-00b4d8?style=flat-square&logo=materialdesign)](https://piotras1.github.io/piotras-cards-pack/tile_css_editor.html)
[![MDI Icons](https://img.shields.io/badge/HA%20Icons-Search%20Gallery-00b4d8?style=flat-square&logo=materialdesign)](https://piotras1.github.io/piotras-cards-pack/mdi-icon-browser.html)

| Documentation | Installation |
| :--- | :--- |
| [![Documentation](https://img.shields.io/badge/Documentation-View%20Guide-blue?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Piotras1/piotras-climate-info) | [![HACS Installation](https://img.shields.io/badge/HACS-Install%20Repo-orange?style=for-the-badge&logo=home-assistant&logoColor=white)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Piotras1&repository=piotras-climate-info&category=plugin) |
> [!TIP]
> **Manual Installation:** Full step-by-step instructions are available in the **Documentation** link above.

### Description
- **A versatile Home Assistant card designed for comprehensive climate monitoring and energy tracking with 4 distinct, responsive layouts.**
- **It features a smart animation system with anti-flicker thresholds and fluid color interpolation that visually reflects temperature or power levels.**
- **Equipped with a specialized Energy & Percentage mode (Layout 4) featuring a dynamic vertical gauge for precise electrical measurement tracking.**

---

# 🍩 Piotras Energy Donut
<img width="1200" height="799" alt="piotras-energy-donut" src="https://github.com/user-attachments/assets/474b4e49-a916-4ee2-9f7a-b7d75d660d5d" />
<br><br>

![HACS](https://img.shields.io/badge/HACS-Default-orange?style=flat-square)
![HACS Downloads](https://img.shields.io/github/downloads/Piotras1/piotras-energy-donut/piotras-energy-donut-loader.js?logo=homeassistant&color=41BDF5&displayAssetName=false)
![GitHub Stars](https://img.shields.io/github/stars/Piotras1/piotras-energy-donut?style=flat-square&logo=github&label=stars&color=brightgreen)
![GitHub Issues](https://img.shields.io/github/issues/Piotras1/piotras-energy-donut?style=flat-square&logo=github&label=issues)
[![GitHub Release](https://img.shields.io/github/v/release/Piotras1/piotras-energy-donut?style=flat-square&logo=github&label=released)](https://github.com/Piotras1/piotras-energy-donut/releases)
![GitHub Release Date](https://img.shields.io/github/release-date/Piotras1/piotras-energy-donut?style=flat-square&logo=github&label=released)

[![GitHub Discussions](https://img.shields.io/badge/Discussions-Join%20the%20community-blueviolet?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-energy-donut/discussions)
![GitHub Discussions](https://img.shields.io/github/discussions/Piotras1/piotras-energy-donut?style=flat-square&logo=github&label=discussions&color=blueviolet)

| Documentation | Installation |
| :--- | :--- |
| [![Documentation](https://img.shields.io/badge/Documentation-View%20Guide-blue?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Piotras1/piotras-energy-donut) | [![HACS Installation](https://img.shields.io/badge/HACS-Install%20Repo-orange?style=for-the-badge&logo=home-assistant&logoColor=white)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Piotras1&repository=piotras-energy-donut&category=plugin) |
> [!TIP]
> **Manual Installation:** Full step-by-step instructions are available in the **Documentation** link above.

### Description
- **An interactive donut chart featuring 3 unique layout modes, including callout lines with automatic collision avoidance and a dedicated percentage gauge.**
- **It offers a smart "Focus Mode" where clicking any segment isolates it, showing detailed values and percentages in the center with an auto-reset timer.**
- **Highly customizable with a 20-color palette, configurable display limits for top devices, and a full visual editor for effortless configuration without YAML.**

---

# 📊 Piotras Value Bar

<img width="1200" height="799" alt="piotras-value-bar" src="https://github.com/user-attachments/assets/c0e1a01e-f21c-4015-9e94-b2cd24e17ab6" />
<br><br>

![HACS](https://img.shields.io/badge/HACS-Default-orange?style=flat-square)
![HACS Downloads](https://img.shields.io/github/downloads/Piotras1/piotras-value-bar/piotras-value-bar-loader.js?logo=homeassistant&color=41BDF5&displayAssetName=false)
![GitHub Stars](https://img.shields.io/github/stars/Piotras1/piotras-value-bar?style=flat-square&logo=github&label=stars&color=brightgreen)
![GitHub Issues](https://img.shields.io/github/issues/Piotras1/piotras-value-bar?style=flat-square&logo=github&label=issues)
[![GitHub Release](https://img.shields.io/github/v/release/Piotras1/piotras-value-bar?style=flat-square&logo=github&label=released)](https://github.com/Piotras1/piotras-value-bar/releases)
![GitHub Release Date](https://img.shields.io/github/release-date/Piotras1/piotras-value-bar?style=flat-square&logo=github&label=released)

[![GitHub Discussions](https://img.shields.io/badge/Discussions-Join%20the%20community-blueviolet?style=flat-square&logo=github)](https://github.com/Piotras1/piotras-value-bar/discussions)
![GitHub Discussions](https://img.shields.io/github/discussions/Piotras1/piotras-value-bar?style=flat-square&logo=github&label=discussions&color=blueviolet)

| Documentation | Installation |
| :--- | :--- |
| [![Documentation](https://img.shields.io/badge/Documentation-View%20Guide-blue?style=for-the-badge&logo=read-the-docs&logoColor=white)](https://github.com/Piotras1/piotras-value-bar) | [![HACS Installation](https://img.shields.io/badge/HACS-Install%20Repo-orange?style=for-the-badge&logo=home-assistant&logoColor=white)](https://my.home-assistant.io/redirect/hacs_repository/?owner=Piotras1&repository=piotras-value-bar&category=plugin) |
> [!TIP]
> **Manual Installation:** Full step-by-step instructions are available in the **Documentation** link above.

### Description
- **Clean and modern sensor bars featuring 3 orientations—including a unique vertical comparison mode with a shared scale and horizontal scrolling support.**
- **It offers 3 flexible layout modes to place names and values either beside, above, or directly inside the bars, ensuring a perfect fit for any dashboard column.**
- **Advanced visualization features include smooth or stepped gradients with up to 13 colors, animated alert indicators when thresholds are exceeded, and a full visual editor.**

---

*Crafted by Piotras with care for reliability.*
