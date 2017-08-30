var list = [
{
	id:1,
	title: 'Si vas a utilizar un pasaje de Lorem Ipsum, Necesitás estar seguro',
	location: 'Juan Francisco Seguí 3900, Palermo Chico, Ciudad Autónoma de Buenos Aires, Argentina',
	images:[
		'http://imgar.zonapropcdn.com/avisos/1/00/42/40/21/61/720x532/1575869487.jpg',
		'http://imgar.zonapropcdn.com/avisos/1/00/42/40/21/61/720x532/1575869488.jpg',
		'http://imgar.zonapropcdn.com/avisos/1/00/42/40/21/61/720x532/1575869489.jpg'
	],
	description: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta)',
	price:1400000,
	meters:380,
	attributes:[
		'380 m2',
		'3 Dormitorios',
		'2 Baños',
		'2 Cocheras'
	],
	favorite: 0,
},
{
	id:2,
	title: 'Emprendimiento en pozo Villarroel 1232 desde U$s 74.000',
	location: 'Villarroel 1232, Villa Crespo, Ciudad Autónoma de Buenos Aires, Argentina',
	images:[
		'http://imgar.zonapropcdn.com/avisos/1/00/42/49/32/58/1200x1200/1579529131.jpg',
		'http://imgar.zonapropcdn.com/avisos/1/00/42/49/32/58/1200x1200/1579529133.jpg',
		'http://imgar.zonapropcdn.com/avisos/1/00/42/49/32/58/1200x1200/1579529137.jpg'
	],
	description: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta). Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta). ',
	price:74000,
	meters:44,
	attributes:[
		'44 m2',
		'2 Dormitorios',
		'1 Baño',
		'2 Balcones'
	],
	favorite: 1,
},
];

var createModel = function(attributes) {
	var model = {
		attributes: attributes,
		selectors: {
			modal: '#modal',
			items: '#list',
			itemPrefix: '#property-',
			media: '.item-media',
			contact: '.contact',
			carousel: '.carousel',
			carouselPrevControl: '.item-media-arrow-left',
			carouselNextControl: '.item-media-arrow-right',
			heartTarget: '.heart-border',
			heartToggle: '.heart-toggle',
			priceQuantity: '.item-main-price-quantity',
			priceUnityFormatted: '.item-main-price-unity-formatted'
		},
		save: function() {
			var attributes =  {};
			if (localStorage.getItem('model-'+model.attributes.id)) {
				attributes = JSON.parse(localStorage.getItem('model-'+model.attributes.id));
			}
			attributes = Object.assign(attributes, model.attributes);
			localStorage.setItem('model-'+model.attributes.id,JSON.stringify(attributes));
		},
		load: function() {
			var attributes =  {};
			if (localStorage.getItem('model-'+model.attributes.id)) {
				model.attributes = JSON.parse(localStorage.getItem('model-'+model.attributes.id));
			}
		},
		getSelectorItem: function() {
			return model.selectors.itemPrefix+model.attributes.id;
		},
		getSelectorMedia: function() {
			return model.getSelectorItem()+' '+model.selectors.media;
		},
		getSelectorContact: function() {
			return model.getSelectorItem()+' '+model.selectors.contact;
		},
		getSelectorCarousel: function() {
			return model.getSelectorItem()+' '+model.selectors.carousel;
		},
		getSelectorCarouselPrevControl: function() {
			return model.getSelectorCarousel()+' '+model.selectors.carouselPrevControl;
		},
		getSelectorCarouselNextControl: function() {
			return model.getSelectorCarousel()+' '+model.selectors.carouselNextControl;
		},
		getSelectorHeartTarget: function() {
			return model.getSelectorItem()+' '+model.selectors.heartTarget;
		},
		getSelectorHeartToggle: function() {
			return model.getSelectorItem()+' '+model.selectors.heartToggle;
		},
		getSelectorPriceQuantity: function() {
			return model.getSelectorItem()+' '+model.selectors.priceQuantity;
		},
		getSelectorPriceQuantityFormatted: function() {
			return model.getSelectorItem()+' '+model.selectors.priceUnityFormatted;
		},
		getPriceFormatted: function() {
			return numeral(Math.abs(model.attributes.price)).format('0,0')
		},
		getPriceUnityFormatted: function() {
			return numeral(
				Math.round((
					Math.abs(model.attributes.price / model.attributes.meters)
					).toFixed(2))
				).format('0,0')
		},
		render: function(template) {
			var templateData = Object.assign(model.attributes, {
				id: model.attributes.id,
				priceFormatted: model.getPriceFormatted(),
				priceUnityFormatted: model.getPriceUnityFormatted(),
			});
			return Mustache.render(template, templateData);
		},
		events: function() {

			$(model.getSelectorMedia()).imagesLoaded(
				{ background: true },
				function() {
					$(model.getSelectorItem()).addClass('loaded');
				}
			);

			/* Carousel */
			$(model.getSelectorCarousel()).carousel({
				fullWidth: true
			});

			$(model.getSelectorCarouselPrevControl()).click(function(e){
				$(model.getSelectorCarousel()).carousel('prev');
				e.preventDefault();
			});

			$(model.getSelectorCarouselNextControl()).click(function(e){
				$(model.getSelectorCarousel()).carousel('next');
				e.preventDefault();
			});

			/* Heart Event */
			$(model.getSelectorHeartToggle()).click(function(e){
				model.attributes.favorite = !model.attributes.favorite;
				$(model.getSelectorHeartTarget()).toggleClass('active');
				model.save();
			});

			if (model.attributes.favorite) {
				$(model.getSelectorHeartTarget()).toggleClass('active');
			}

			/* price */
			$(model.getSelectorPriceQuantity()).click(function(e){
				var tpl = "<input type='number' min='0' step='10000'/>";
				var input = $(tpl);
				input.val(Math.abs(model.attributes.price));
				$(this).html(input);
				$(input).focus();

				var change = function(value) {
					model.attributes.price = Math.abs(value);
					model.save();
					$(model.getSelectorPriceQuantityFormatted()).html(
						model.getPriceUnityFormatted()
					);
				}

				$(input).blur(function(e){
					change($(this).val());
					$(model.getSelectorPriceQuantity()).html(
						model.getPriceFormatted()
					);
				});

				$(input).keyup(function(e){
					change($(this).val());
				});

				$(input).click(function(e){
					change($(this).val());
					e.preventDefault();
					e.stopPropagation();
				});
			});

			/* Contact */
			$(model.getSelectorContact()).click(function(e){
				$(model.selectors.modal).modal('open');
			});
		}
	};
	model.load();
	return model;
}

$(document).ready(function(){

	$('#modal').modal();

	numeral.locale('es-es');
	$.get({url:'templates/property.html',cache: false}, function(template){
		list.forEach(function(item, index){
			var model = createModel(item);
			var rendered = model.render(template);
			$(model.selectors.items).append(rendered);
			model.events();
		});
	});

});