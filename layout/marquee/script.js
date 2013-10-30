/** 
 * Marquee layout - Painel Web
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */
var MarqueeLayout = {
    
    load: function(config) {
        if (config.marquee) {
            $('#marquee p').text(config.marquee);
        }
    }
    
};