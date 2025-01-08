(function($) {
  $.fn.mauGallery = function(options) {
    var options = $.extend($.fn.mauGallery.defaults, options);
    var tagsCollection = [];
    return this.each(function() {
      $.fn.mauGallery.methods.createRowWrapper($(this));
      if (options.lightBox) {
        $.fn.mauGallery.methods.createLightBox(
          $(this),
          options.lightboxId,
          options.navigation
        );
      }
      $.fn.mauGallery.listeners(options);

      $(this)
        .children(".gallery-item")
        .each(function(index) {
          $.fn.mauGallery.methods.responsiveImageItem($(this));
          $.fn.mauGallery.methods.moveItemInRowWrapper($(this));
          $.fn.mauGallery.methods.wrapItemInColumn($(this), options.columns);
          var theTag = $(this).data("gallery-tag");
          if (
            options.showTags &&
            theTag !== undefined &&
            tagsCollection.indexOf(theTag) === -1
          ) {
            tagsCollection.push(theTag);
          }
        });

      if (options.showTags) {
        $.fn.mauGallery.methods.showItemTags(
          $(this),
          options.tagsPosition,
          tagsCollection
        );
      }

      $(this).fadeIn(500);
    });
  };
  $.fn.mauGallery.defaults = {
    columns: 3,
    lightBox: true,
    lightboxId: null,
    showTags: true,
    tagsPosition: "bottom",
    navigation: true
  };
  $.fn.mauGallery.listeners = function(options) {
    $(".gallery-item").on("click", function() {
      if (options.lightBox && $(this).prop("tagName") === "IMG") {
        $.fn.mauGallery.methods.openLightBox($(this), options.lightboxId);
      } else {
        return;
      }
    });

    $(".gallery").on("click", ".nav-link", $.fn.mauGallery.methods.filterByTag);
    $(".gallery").on("click", ".mg-prev", () =>
      $.fn.mauGallery.methods.prevImage(options.lightboxId)
    );
    $(".gallery").on("click", ".mg-next", () =>
      $.fn.mauGallery.methods.nextImage(options.lightboxId)
    );
  };
  $.fn.mauGallery.methods = {
    createRowWrapper(element) {
      if (
        !element
          .children()
          .first()
          .hasClass("row")
      ) {
        element.append('<div class="gallery-items-row row"></div>');
      }
    },
    wrapItemInColumn(element, columns) {
      if (columns.constructor === Number) {
        element.wrap(
          `<div class='item-column mb-4 col-${Math.ceil(12 / columns)}'></div>`
        );
      } else if (columns.constructor === Object) {
        var columnClasses = "";
        if (columns.xs) {
          columnClasses += ` col-${Math.ceil(12 / columns.xs)}`;
        }
        if (columns.sm) {
          columnClasses += ` col-sm-${Math.ceil(12 / columns.sm)}`;
        }
        if (columns.md) {
          columnClasses += ` col-md-${Math.ceil(12 / columns.md)}`;
        }
        if (columns.lg) {
          columnClasses += ` col-lg-${Math.ceil(12 / columns.lg)}`;
        }
        if (columns.xl) {
          columnClasses += ` col-xl-${Math.ceil(12 / columns.xl)}`;
        }
        element.wrap(`<div class='item-column mb-4${columnClasses}'></div>`);
      } else {
        console.error(
          `Columns should be defined as numbers or objects. ${typeof columns} is not supported.`
        );
      }
    },
    moveItemInRowWrapper(element) {
      element.appendTo(".gallery-items-row");
    },
    responsiveImageItem(element) {
      if (element.prop("tagName") === "IMG") {
        element.addClass("img-fluid");
      }
    },
    openLightBox(element, lightboxId) {
        $(`#${lightboxId}`)
        .find(".lightboxImage")
        .attr("src", element.attr("src"));
      $(`#${lightboxId}`).modal("toggle");
    },
    createLightBox(gallery, lightboxId, navigation) {
      const lightboxHtml = `
        <div class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-body">
                ${
                  navigation
                    ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>'
                    : '<span style="display:none;" />'
                }
                <img class="lightboxImage img-fluid" alt="Contenu de l\'image affichée dans la modale au clic"/>
                ${
                  navigation
                    ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>'
                    : '<span style="display:none;" />'
                }
              </div>
            </div>
          </div>
        </div>`;
    
      gallery.append(lightboxHtml);
    
      // Attacher les événements avec suppression des évents multiples
      const lightboxElement = $(`#${lightboxId || "galleryLightbox"}`);

    },
    
    prevImage(lightboxId) {
      let activeImage = $(".lightboxImage").attr("src"); // L'image actuellement affichée
      let imagesCollection = [];
    
      // Collecter les images visibles selon le tag actif
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      $(".gallery-item").each(function() {
        if (
          activeTag === "all" ||
          $(this).data("gallery-tag") === activeTag
        ) {
          imagesCollection.push($(this));
        }
      });
    
      // Trouver l'index de l'image active
      let index = imagesCollection.findIndex(
        img => img.attr("src") === activeImage
      );
      // Calculer l'index de l'image précédente
      let prevIndex = (index - 1 + imagesCollection.length) % imagesCollection.length;
      // Mettre à jour la lightbox avec l'image précédente
      let prevImage = imagesCollection[prevIndex];
      $(".lightboxImage").attr("src", prevImage.attr("src"));
    },
    
    nextImage(lightboxId) {
      let activeImage = $(".lightboxImage").attr("src"); // L'image actuellement affichée
      let imagesCollection = [];
    
      // Collecter les images visibles selon le tag actif
      let activeTag = $(".tags-bar span.active-tag").data("images-toggle");
      $(".gallery-item").each(function() {
        if (
          activeTag === "all" ||
          $(this).data("gallery-tag") === activeTag
        ) {
          imagesCollection.push($(this));
        }
      });
    
      // Trouver l'index de l'image active
      let index = imagesCollection.findIndex(
        img => img.attr("src") === activeImage
      );
    
      // Calculer l'index de l'image suivante
      let nextIndex = (index + 1) % imagesCollection.length;
    
      // Mettre à jour la lightbox avec l'image suivante
      let nextImage = imagesCollection[nextIndex];
      $(".lightboxImage").attr("src", nextImage.attr("src"));
    },
    
    showItemTags(gallery, position, tags) {
      var tagItems =
        '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      $.each(tags, function(index, value) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${value}">${value}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.append(tagsRow);
      } else if (position === "top") {
        gallery.prepend(tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    },
    filterByTag() { //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if ($(this).hasClass("active-tag")) {
          return; // si l'élément est déjà actif, ne fait rien
      }
  
      // retire la classe active des boutons deja actifs
      $(".active-tag").removeClass("active active-tag");
  
      // ajoute la classe active au bouton cliqué
      $(this).addClass("active active-tag");
  
      // Récupérer la balise associée
      var tag = $(this).data("images-toggle");
  
      // parcours les éléments de la galerie
      $(".gallery-item").each(function() {
          var $itemColumn = $(this).parents(".item-column"); // colonne contenant l'élément
  
          if (tag === "all") {
              // affiche tous les éléments
              $itemColumn.show(300);
          } else if ($(this).data("gallery-tag") === tag) {
              // affiche les éléments qui correspondent
              $itemColumn.show(300);
          } else {
              // cache les éléments qui ne correspondent pas
              $itemColumn.hide(300);
          }
      });
  }
  };
})(jQuery);
