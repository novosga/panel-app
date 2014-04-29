/** 
 * Marquee layout - Painel Web
 * @author Rogerio Lino <rogeriolino@gmail.com>
 */
var MarqueeLayout = function(config) {
    "use strict";
    
    var texts = [];
    var duration = config.duration || 20; // seconds
    
    var animate = function(p) {
        p.animate({
            left: p.prop('scrollWidth') * -1
        }, duration * 1000, "linear", function() {
            console.log('goto x = ' + p.data('left'));
            p.css('left', p.data('left') + 'px');
            animate(p);
        });
    };
    
    if (config && config.marquee) {
        var marquee = $('#marquee');
        marquee.find('p').each(function(i, e) {
            var p = $(e);
            p.text(config.marquee);
            var x = marquee.width();
            p.data('left', x);
            p.css('left', x + 'px');
            animate(p);
            texts.push(p);
        });
        
    }
    
};
