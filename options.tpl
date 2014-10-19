<div id="options">
    <div class="blackout"></div>
    <div class="content">
        <ul>
            <li class="option option-single">
                Transparency
                <div class="option-selection">
                    <select id="transparency">
                        <option value="0.1">90%</option>
                        <option value="0.2">80%</option>
                        <option value="0.3">70%</option>
                        <option value="0.4">60%</option>
                        <option value="0.5">50%</option>
                        <option value="0.6">40%</option>
                        <option value="0.7">30%</option>
                        <option value="0.8">20%</option>
                        <option value="0.9" selected="selected">10% (Default)</option>
                        <option value="1">0%</option>
                    </select>
                </div>
            </li>
            <li class="option option-single">
                Wallpaper
                <div class="option-selection">
                    <a href="#" id="wallpapers">Change Wallpaper</a>
                </div>
            </li>
            <li class="option option-single">
                Enable Bookmarks
                <div class="option-selection">
                    <a href="#" id="enable-bookmarks">Click to enable</a>
                </div>
            </li>
            <li class="option option-single">
                Layout
                <div class="option-selection">
                    <select name="allInOne" id="allInOne">
                        <option value="">One Per Page</option>
                        <option value="allInOne">All in One</option>
                    </select>
                </div>
            </li>
            <li class="option option-single">
                Temperature Units
                <div class="option-selection">
                    <select name="units" id="units">
                        <option value="f">Fahrenheit</option>
                        <option value="c">Celsius</option>
                    </select>
                </div>
            </li>
            <li class="option option-single">
                Minimal Weather
                <div class="option-selection">
                    <select id="weatherMinimal">
                        <option value="">Off</option>
                        <option value="1">On</option>
                    </select>
                </div>
            </li>
            <li class="option option-single">
                Location
                <div class="option-selection">
                    <input type="text" id="input_location" placeholder="Use current location" />
                </div>
            </li>
            <li class="option option-single">
                Features &mdash; <span style="color: #555; font-size: small">Click to toggle, drag to rearrange</span>
                <div id="option-features">
                </div>
            </li>
        </ul>
        <div class="button_bar">
            <button class="save">Save</button> <button class="cancel">Cancel</button>
        </div>
    </div>
</div>