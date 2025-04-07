

$(document).ready(function () {
    
    function commas(value) {
        const parts = value.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }

    // Function to colorize all fields with class "colored"
    function colorizeAllColoredFields() {
        $(".colored").each(function () {
            const val = parseFloat($(this).text().replace(/,/g, ''));
            if (val > 0) {
                $(this).css("color", "green");
            } else if (val < 0) {
                $(this).css("color", "red");
            } else {
                $(this).css("color", "black");
            }
        });
    }

    function calculateReport() {
        // Account Section
        const balance = parseFloat($("#balance").val());
        const leverage = parseInt($("#leverage").val());
        const marginCall = parseFloat($("#margincall").val());
        const stopOut = parseFloat($("#stopout").val());

        // Instrument Section
        const symbol = $("#symbol").val();
        const contractSize = parseInt($("#contractsize").val());
        const buyMarginInit = parseFloat($("#buy_margin_init").val());
        const buyMarginMaint = parseFloat($("#buy_margin_maint").val());
        const sellMarginInit = parseFloat($("#sell_margin_init").val());
        const sellMarginMaint = parseFloat($("#sell_margin_maint").val());

        // Trade Section
        const entryPrice = parseFloat($("#entry").val());
        const currentPrice = parseFloat($("#current").val());
        const lots = parseFloat($("#lots").val());
        const position = $("input[name='position']:checked").val();

        // Free Margin Custom level Input
        const freemargin_custom_level = parseFloat($("#freemargin_custom_level").val());

        // Report Section
        const r_units_traded = $("#r_units_traded");
        const r_value_traded = $("#r_value_traded");
        const r_current_value = $("#r_current_value");
        const r_delta = $("#r_delta");

        const r_delta_per_unit = $("#r_delta_per_unit");

        const r_balance = $("#r_balance");
        const r_equity = $("#r_equity");
        const r_margin = $("#r_margin");
        const r_free_margin = $("#r_free_margin");
        const r_margin_level = $("#r_margin_level");

        const r_freemargin_100_level = $("#r_freemargin_100_level");
        const r_freemargin_50_level = $("#r_freemargin_50_level");
        const r_freemargin_0_level = $("#r_freemargin_0_level");
        const r_freemargin_x_level = $("#r_freemargin_x_level");

        const r_liquidation_level = $("#r_liquidation_level");
        const r_double_level = $("#r_double_level");

        // Calculate Units Traded
        const unitsTraded = lots * contractSize;
        r_units_traded.text(commas(unitsTraded.toFixed(2)));

        // Calculate Value Traded
        const valueTraded = unitsTraded * entryPrice;
        r_value_traded.text(commas(valueTraded.toFixed(2)));

        // Calculate Current Value
        const currentValue = unitsTraded * currentPrice;
        r_current_value.text(commas(currentValue.toFixed(2)));


        // Calculate Delta
        const deltaPerUnit = (currentPrice - entryPrice);
        const delta = deltaPerUnit * unitsTraded;
        //const currentValueSigned = (position === "short" ? -1 : 1) * currentValue; // Adjust for short position
        r_delta.text(commas(delta.toFixed(2)));


        // Calculate Delta per Unit (Price Change per unit)    
        r_delta_per_unit.text(commas(deltaPerUnit.toFixed(2)));


        // Calculate Balance
        const balanceValue = balance;
        r_balance.text(commas(balanceValue.toFixed(2)));

        // Calculate Equity
        const equityValue = balanceValue - (delta * (position === "short" ? 1 : -1));
        r_equity.text(commas(equityValue.toFixed(2)));

        // Calculate Margin
        const marginValue = valueTraded * (position === "long" ? buyMarginInit : sellMarginInit);
        r_margin.text(commas(marginValue.toFixed(2)));

        // Calculate Free Margin
        const freeMarginValue = equityValue - marginValue;
        r_free_margin.text(commas(freeMarginValue.toFixed(2)));

        // Calculate Margin Level
        const marginLevelValue = (equityValue * 100) / marginValue;
        r_margin_level.text(commas(marginLevelValue.toFixed(2)) + "%");

        

        function calcPriceForFreeMarginLevel(targetMarginLevelPercent) {
            const targetEquity = marginValue * (targetMarginLevelPercent / 100);
            const requiredPnL = targetEquity - balance;
            const deltaPrice = requiredPnL / (unitsTraded * (position === "long" ? 1 : -1));
            return entryPrice + deltaPrice;
        }

        // Calculate Free Margin Level at 100%
        r_freemargin_100_level.text(commas(calcPriceForFreeMarginLevel(100).toFixed(2)));

        // Calculate Free Margin Level at 50%
        r_freemargin_50_level.text(commas(calcPriceForFreeMarginLevel(50).toFixed(2)));

        // Calculate Free Margin Level at 0%
        r_freemargin_0_level.text(commas(calcPriceForFreeMarginLevel(0).toFixed(2)));

        // Calculate Free Margin Level at Custom Level
        r_freemargin_x_level.text(commas(calcPriceForFreeMarginLevel(freemargin_custom_level).toFixed(2)));

        // Calculate Liquidation Level
        r_liquidation_level.text(commas(calcPriceForFreeMarginLevel(0).toFixed(2)));

        // Calculate Double Level        
        function calcPriceForDoubleBalance() {
            const targetPnL = balance;
            const deltaPrice = targetPnL / (unitsTraded * (position === "long" ? 1 : -1));
            return entryPrice + deltaPrice;
        }

        r_double_level.text(commas(calcPriceForDoubleBalance().toFixed(2)));

        colorizeAllColoredFields(); // Call the function to colorize all fields

    }

    // Button click triggers calculation
    $("input[type='button']").click(function () {
        calculateReport();
    });

    // Pressing Enter triggers calculation
    $(document).on("keydown", function (e) {
        if (e.key === "Enter") {
            calculateReport();
        }
    });

    // Set default values
    $("#balance").val(100);
    $("#leverage").val(2);
    $("#margincall").val(60);
    $("#stopout").val(0);

    $("#symbol").val("BTCUSDm");
    $("#contractsize").val(1);
    $("#buy_margin_init").val(0.0025);
    $("#buy_margin_maint").val(0.0025);
    $("#sell_margin_init").val(0.0025);
    $("#sell_margin_maint").val(0.0025);

    $("#entry").val(83100);
    $("#current").val(83200);
    $("#lots").val(0.1);

});
