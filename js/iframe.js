var reset;
var ClothID = 'TDA_All';
var Brand = 'TDA';
var tags_chosen = {};
let startX, endX;
let all_Route;

//finish Loading
// $('#loadingbar').hide();
// $('#pback').show();
// $("#containerback").show();

$(document).ready(function() {
    fetchData();
    $('#intro-page').show();

    //finish Loading
    $('#loadingbar').hide();
    $('#pback').show();
    $("#containerback").show();

   
    
    // fetchData();
});
const get_recom_res = () =>{
    $('#loadingbar_recom').show();
    let options = {
        method: 'POST',
        headers: {accept: 'application/json', 'content-type': 'application/json'},
        body: JSON.stringify({
            Brand: Brand,
            Tags: tags_chosen,
            NUM:12
        })
        };
    
    console.log("tags chosen:", tags_chosen)
    
    fetch('https://ldiusfc4ib.execute-api.ap-northeast-1.amazonaws.com/v0/extension/recom_product', options)
        .then(response => response.json())
        .then(response => {
            console.error('err response', response);
            const messageData = {
                type: 'result',
                value: true
              };
            window.parent.postMessage(messageData, '*');
            show_results(response);})
        .catch(err => {
            console.error('err', err);
            ;});
    }

const show_results = (response) =>{ //只出現其中三個
    $('#loadingbar_recom').hide();
    $('#container-recom').show();
    const itemCount = response?.Item?.length || 0
    console.log(itemCount,"itemcount")
    console.log(response, "responessssss");
    function getRandomNumbers(max, count) {
        let randomNumbers = [];
        while (randomNumbers.length < count) {
            let num = Math.floor(Math.random() * max);
            if (!randomNumbers.includes(num)) {
                randomNumbers.push(num);
            }
        }
        return randomNumbers;
    }
    if(itemCount===0||!response)
        {
             $(`#container-recom`).find('.axd_selections').append(`
                  <div class="update_delete" style="font-size:14px">
                您選擇的商品沒有最合適建議 請您參考相關商品
                </div>
                 `)
                 return
        }
    const finalitem = getRandomNumbers(itemCount-1, 3)
    const finalitemCount = 3
    console.log(finalitem);
    //for(let i = 0 ; i < itemCount; i++){
    for(let ii in finalitem){
        let i = finalitem[ii]
        var ItemName = response.Item[i].ItemName
        if(ItemName.length >= 16){
            ItemName = ItemName.substring(0, 15) + '...'
        }
    //     $(`#container-recom`).find('.axd_selections').append(`
    //         <div class="ad-item axd_selection cursor-pointer update_delete" onclick="window.open('${response.Item[i].Link}')" data-title="${img.alt}" data-link="${response.Item[i].Link}">
    //             <div class="item-img">
    //                 <img class="image-responsive update_delete" src="${img.src}" data-src="${
    //       img.src
    //     }" alt="${img.alt || "Image"}" />
    //             </div>
    //               <div class="item-info">
    //                 <h3 class="item-title">${ItemName}</h3>
    //              ${
    //                 response.Item[i].price
    //                  ? `
    //            <div class="discount-content">
    //                 <p class="item-price">$${response.Item[i].price}</p>
    //                 <p class="item-price--original">$${response.Item[i].price}</p>
    //                 </div>
    //             `
    //                  : ` <p class="item-price--original">$${response.Item[i].price}</p>`
    //              }
    //             </div>
    //         </div>
    // `)
        $(`#container-recom`).find('.axd_selections').append(`
             <div class="axd_selection cursor-pointer update_delete ad-item">
        <a href="${response.Item[i].Link}" target="_blank" class="update_delete" style="text-decoration: none;">
           
                <img class="c-recom" id="container-recom-${i}" data-item="0" src="${response.Item[i].Imgsrc}"
                 onerror="this.onerror=null;this.src='./../../img/img-default.png'"
                >
                <div>
                <p class="recom-text item-title line-ellipsis-2" id="recom-${i}-text">${ItemName}</p>
               ${
                    response.Item[i].price
                     ? `
               <div class="discount-content">
                    <p class="item-price recom-price">$${response.Item[i].price}</p>
                    <p class="item-price--original">$${response.Item[i].price}</p>
                    </div>
                `
                     : ` <p class="item-price--original recom-price">$${response.Item[i].price}</p>`
                 }
                </div>
           
        </a>
         </div>
        `)

    //     $(`#container-recom`).find('.axd_selections').append(`
    //         <div class="axd_selection cursor-pointer update_delete">
    //    <a href="${response.Item[i].Link}" target="_blank" class="update_delete" style="text-decoration: none;">
          
    //            <img class="c-recom" id="container-recom-${i}" data-item="0" src="${response.Item[i].Imgsrc}">
    //            <div>
    //            <p class="recom-text line-ellipsis-2" id="recom-${i}-text">${ItemName}</p>
    //            <p class="recom-price">NT$ ${response.Item[i].price}</p>
    //            </div>
    //            <div style="position: absolute;right: 14px;top: 10px;border-radius: 3px;width: 60px;height: 30px;background: rgba(255, 255, 255, 0.75);"></div>
          
    //    </a>
    //     </div>
    //    `)
      
    }

    const selectionContainer=document.querySelector(`#container-recom .selection`)


    if (finalitemCount === 2) {
        selectionContainer.classList.add('two-elements');
    } else if (finalitemCount === 3) {
        selectionContainer.classList.add('three-elements');

        selectionContainer.querySelectorAll('.axd_selection')[2].classList.add('overflow-opacity');

        document.querySelector('.three-elements .axd_selections').addEventListener('scroll', function(e) {
            var container = e.target;
            var selections = container.querySelectorAll('.axd_selection');
          
            selections.forEach(function(selection, index) {
              if (isVisible(selection, container)) {
                selection.classList.remove('overflow-opacity');
                
              } else {
                selection.classList.add('overflow-opacity');
              }
            });
          });
          
          function isVisible(element, container) {
            var elementRect = element.getBoundingClientRect();
            var containerRect = container.getBoundingClientRect();
          
            return (
              elementRect.right < containerRect.right &&
              elementRect.left > containerRect.left
            );
          }
    } else if (finalitemCount >= 4) {
        selectionContainer.classList.add('four-elements');
    }
    }

const fetchData = async () => {
    const options = { method: 'GET', headers: { accept: 'application/json' } };
    try {

    var obj;
    // 塞空值
    const response = await fetch('https://xjsoc4o2ci.execute-api.ap-northeast-1.amazonaws.com/v0/extension/run_product?Brand='+Brand+'&ClothID='+ClothID, options);
    const data = await response.json();
        obj = data; console.log("obj", obj);
        if(!obj.Product) return;
        all_Route = obj.Product.Routes[0]['TagGroups_order']
        let Route_in_frame = {}
        for (var n = 0 ; n < all_Route.length ; n++){
            Route_in_frame[all_Route[n]] = []
        }
        for (var j = 0 ; j < obj.RouteConfig.length ; j++){
            let item = obj.RouteConfig[j]
            // let idx = all_Route.indexOf(item.TagGroup.S)
            Route_in_frame[item.TagGroup.S].push(item)
        }
        console.log(Route_in_frame, "dog")

        for (var r in Route_in_frame){
            console.log('TagGroup : '+r)
            document.getElementById('pback').insertAdjacentHTML('beforebegin',  
            `<div class='container mbinfo animX update_delete' id="container-${r.replaceAll(' ','')}">
                    <div class="c_header" id="container-x-header" style="border-bottom: 4px solid #F5F5F4">
                        
                        <img class="type_backarrow" id="container-${r.replaceAll(' ','')}-backarrow" src="./../img/icon-next.svg" width="100%"
                        height="100%" >
                        <div class="header-text">
                            <span style="margin-bottom: 0.3em">${r}</span>
                            <p>${Route_in_frame[r].length > 0 ? Route_in_frame[r][0].Description?.S : ''}</p>
                        </div>
                        <img class='c-${r.replaceAll(' ','')} skip type_backarrow flipped-image' src="./../img/icon-next.svg" width="100%"
                        height="100%" >
                    </div>

                        <div class="selection_scroll slide swiper-container-${r.replaceAll(' ','')}">
                            <div class="swiper-wrapper" >
                            </div>         
                        </div>
                    
                         <div class="pagination-${r.replaceAll(' ','')} pag-margin" style="text-align: center; ">
                        </div>
                     <div class="footer">
                        <a class='c-${r.replaceAll(' ','')} skip'>略過</a>
                     </div>
                       
                    </div>`
                )

                //first route hide type_backarrow
                if(r===all_Route[0])
                {
                    document.getElementById(`container-${r.replaceAll(' ','')}-backarrow`).style.visibility = 'hidden';
                }
                
                
                var numPerPage = 6;
                const mediaQuery = window.matchMedia('(max-width: 400px)');
                function handleMediaQueryChange(mediaQuery, tar) {
                    console.log(tar)
                    if (mediaQuery.matches) {
                        // 如果屏幕寬度小於或等於 400px
                        numPerPage = 4;
                        
                        init(tar);
                    
                    } else if (!mediaQuery.matches) {
                        // 如果屏幕寬度大於 400px
                        numPerPage = 6;
                        init(tar);
                        
                    }
                    
                }

                

                // 初始檢查
                
                if (mediaQuery.matches && numPerPage !== 4) {
                    // 如果屏幕寬度小於或等於 400px
                    numPerPage = 4;
                    
                
                } else if (!mediaQuery.matches && numPerPage !== 6) {
                    // 如果屏幕寬度大於 400px
                    numPerPage = 6;
                    
                }
                
                

                function init(tar) {
                    let currentPage = 1;
                    var target=tar.replaceAll(' ','')

                    console.log(numPerPage, 'numPerPage')
                
                    $(`#container-${target}`).find('.selection').remove();
                    $(`#container-${target}`).find('.remove-button').remove();

                    $(`#container-${target}`).find(`.pagination-${target}`).empty();
                    
                    

                    const itemCount = Route_in_frame[tar].length;
                    const totalPages = Math.ceil(itemCount / numPerPage);
                    
                    const render_num= itemCount>numPerPage?numPerPage:itemCount;

                    console.log(render_num, "render num", itemCount, numPerPage, (`#container-${target}`))

                    $(`#container-${target}`).find('.swiper-wrapper').append('<div class="selection swiper-slide"><div class="axd_selections selection"></div></div>')

                    for(let rr = 0 ; rr < render_num; rr++){
                        console.log(Route_in_frame[target][rr], "dog")
                        $(`#container-${target}`).find('.axd_selections').append(`
                            <div class="axd_selection ">
                                <div class="image-container">
                                <div>
                                    <img class="axd_img c-${target} tagId-${Route_in_frame[target][rr].Tag.S}" src="${Route_in_frame[target][rr].Imgsrc.S}" onerror="this.style.opacity='0'; this.parentNode.style.backgroundImage='url(./../img/img-default.png)';"  id="container-x-0" data-item="0">
                                </div>
                                
                                    <p>${Route_in_frame[target][rr].Name.S}</p>
                                    
                                </div>
                                
                            </div>
                        
                        `)
                    }
                const selectionContainer = document.querySelector(`#container-${target} .selection`);

                if (itemCount === 2) {
                    selectionContainer.classList.add('two-elements');
                } else if (itemCount === 3) {
                    selectionContainer.classList.add('three-elements');

                    selectionContainer.querySelectorAll('.axd_selection')[2].classList.add('overflow-opacity');
                    


                    document.querySelector('.three-elements .axd_selections').addEventListener('scroll', function(e) {
                        var container = e.target;
                        var selections = container.querySelectorAll('.axd_selection');
                      
                        selections.forEach(function(selection, index) {
                          if (isVisible(selection, container)) {
                            selection.classList.remove('overflow-opacity');
                            
                          } else {
                            selection.classList.add('overflow-opacity');
                          }
                        });
                      });
                      
                      function isVisible(element, container) {
                        var elementRect = element.getBoundingClientRect();
                        var containerRect = container.getBoundingClientRect();
                      
                        return (
                          elementRect.right < containerRect.right &&
                          elementRect.left > containerRect.left
                        );
                      }

                } else if (itemCount >= 4) {
                    selectionContainer.classList.add('four-elements');
                }

                // selectionContainer.classList.add('four-elements');

                

                // function handleSwipe(target) {
                    
                //     if (startX - endX > 50 && currentPage < totalPages) {
                //         console.log('swipe')

                //         currentPage++;
                //         renderPage(currentPage);
                //     } else if (endX - startX > 50 && currentPage > 1) {
                //         console.log('swipe')
                //         currentPage--;
                //         renderPage(currentPage);
                //     }
                // }
            

                if(itemCount>numPerPage)
                {
                    
                    // $(`#container-${target}`).find('.slide').css('width', `${100 * totalPages}%`);

                    createPagination(r);
                    $(`.pagination-${target} .dot[data-page="${1}"]`).addClass('active');
                    var start= numPerPage;
                    for(let i =2; i<=totalPages; i++){
                        $(`#container-${target}`).find('.swiper-wrapper').append(`
                            <div class="selection swiper-slide four-elements" >
                            <div class="axd_selections selection selection-${i}"></div>
                             </div>
                               
                            `)
                        

                        for(let rr = 0 ; rr < render_num && start<itemCount; rr++){
                            $(`#container-${target}`).find(`.selection-${i}`).append(`
                                <div class="axd_selection ">
                                    <div class="image-container">
                                         <div>
                                             <img class="axd_img c-${target} tagId-${Route_in_frame[target][start].Tag.S}" src="${Route_in_frame[target][start].Imgsrc.S}" onerror="this.style.opacity='0'; this.parentNode.style.backgroundImage='url(./../img/img-default.png)';" id="container-x-0" data-item="0">
                                        </div>
                                        <p>${Route_in_frame[target][start].Name.S}</p>
                                        
                                        
                                    </div>
                                </div>
                               
                            `)
                            start++;
                        }
                    }

                    // $(`#container-${target} .selection_scroll`).on('touchstart', function(e) {
                    //     startX = e.originalEvent.touches[0].clientX;
                    // });
                
                    // $(`#container-${target} .selection_scroll`).on('touchmove', function(e) {
                    //     endX = e.originalEvent.touches[0].clientX;
                    // });
                
                    // $(`#container-${target} .selection_scroll`).on('touchend', function(e) {
                    //     if(startX - endX > 50 || endX - startX > 50){
                    //         e.preventDefault();
                    //         e.stopPropagation()
                    //         handleSwipe(target);
                    //     }
                       
                        
                        
                    // });

                    
                    


                    
                    
                }
                

                if(itemCount>=5){
                    // 監聽媒體查詢事件
                    console.log(target, 'listen')
                    mediaQuery.addEventListener('change', (event) => {
                        handleMediaQueryChange(mediaQuery, target);
                    });
                }
                function createPagination(r) {
                    for (let i = 1; i <= totalPages; i++) {
                        $(`.pagination-${target}`).append(`<span class="dot" data-page="${i}"></span>`);
                    }

                    // document.querySelectorAll(`.pagination-${target} .dot`).forEach(dot => {
                    //     dot.addEventListener('click', function() {
                    //         const pageIndex = parseInt(this.getAttribute('data-page'), 10) - 1; // 將 data-page 轉為索引
                    //         swiper.slideTo(pageIndex); // 指示 Swiper 切換到該幻燈片
                    //     });
                    // });

            
                    // $(`.pagination-${target} .dot`).click(function() {
                    //     currentPage = $(this).data('page');
                    //     renderPage(currentPage);
                    // });
                    
                    const swiper = new Swiper(`.swiper-container-${target}`, {
                            direction: 'horizontal',
                            loop: true,
                            
                            threshold: 10,
                            resistanceRatio: 0,
                        
    
                            
                            speed: 300,
                            on: {
                                // slideChange: function() {
                                //     console.log('幻燈片發生變化，當前幻燈片索引：', this.realIndex);
                                // },
                                slideNextTransitionStart: function() {
                                    
                                    var activePageIndex = $(`.pagination-${target} .dot.active`).data('page');
                                    
                                    $(`.pagination-${target} .dot[data-page="${activePageIndex}"]`).removeClass('active');

                                    if(activePageIndex<totalPages) activePageIndex=activePageIndex+1;
                                    else activePageIndex=1;
                                    $(`.pagination-${target} .dot[data-page="${activePageIndex}"]`).addClass('active');
                                    
                                },
                                slidePrevTransitionStart: function() {
                                    var activePageIndex = $(`.pagination-${target} .dot.active`).data('page');
                                    $(`.pagination-${target} .dot[data-page="${activePageIndex}"]`).removeClass('active');

                                    if(activePageIndex>1) activePageIndex=activePageIndex-1;
                                    else activePageIndex=totalPages;
                                    $(`.pagination-${target} .dot[data-page="${activePageIndex}"]`).addClass('active');
                                }
                            },
                        });
                    
                    
                    
                    
                    if(!mediaQuery.matches){
                        $(`#container-${target}`).append(
                            `
                                <button class="nav-button remove-button left-button" >◀</button>
                                <button class="nav-button remove-button right-button">▶</button>
    
                            `
                        )
                        
                        $(`#container-${target} .left-button`).click(function() {
                            swiper.slidePrev();
                            console.log('left')
                        });
                    
                        $(`#container-${target} .right-button`).click(function() {
                            swiper.slideNext();
                            console.log('right')
                        });
                    }

                    

                
                    

                }

                

                bind();

                // function renderPage(page) {
                //     // console.log('page, ', r.replaceAll(' ',''))
                //     $(`.pagination-${target} .dot`).removeClass('active');
                //     $(`.pagination-${target} .dot[data-page="${page}"]`).addClass('active');
                //     $(`#container-${target}`).find('.selection').css('display', 'none');
                //     $(`#container-${target}`).find(`.selection:eq(${(page - 1)})`).show();
                //     if(page==1){
                //         $(`#container-${target} .left-button`).css('display', 'none');
                //     }
                //     else
                //     {
                //         $(`#container-${target} .left-button`).css('display', 'block');
                //     }

                //     if(page==totalPages){
                //         $(`#container-${target} .right-button`).css('display', 'none');
                //     }else{
                //         $(`#container-${target} .right-button`).css('display', 'block');
                //     }
                // }

                // function renderPage(page) {
                
                //     $(`.pagination-${target} .dot`).removeClass('active');
                //     $(`.pagination-${target} .dot[data-page="${page}"]`).addClass('active');
                
                //     var newLeft = -((page - 1) * 100) + '%'; // 根據頁數計算新的左側位置
                //     $(`#container-${target} .slide`).animate({left: newLeft}, 500); 
                
                //     // 處理按鈕顯示
                //     if(page == 1){
                //         $(`#container-${target} .left-button`).hide();
                //     } else {
                //         $(`#container-${target} .left-button`).show();
                //     }
                
                //     if(page == totalPages){
                //         $(`#container-${target} .right-button`).hide();
                //     } else {
                //         $(`#container-${target} .right-button`).show();
                //     }
                // }
                

                

                


                }
                
                
                
                init(r);
                

            //     function checkVisibility() {
            //         const container = document.getElementsByClassName('selection')[0];
            //         const items = container.querySelectorAll('.axd_selection');
            //         console.log(items)
            //         items.forEach(item => {
            //             const rect = item.getBoundingClientRect();
            //             const containerRect = container.getBoundingClientRect();
                
            //             if (rect.left < containerRect.left || rect.right > containerRect.right) {
            //                 item.classList.add('partially-visible');
            //             } else {
            //                 item.classList.remove('partially-visible');
            //             }
            //         });
            //     }
            //     // 監聽滾動事件和初始檢查

            // document.getElementsByClassName('selection')[0].addEventListener('scroll', checkVisibility);
            // window.addEventListener('load', checkVisibility);
                
            // checkVisibility()

               

              

                
        }
        
        
       
        
        //function series
        // var mytap =  ( window.ontouchstart === null ) ? 'touchend' : 'click';
        var mytap = 'click';
        // $('#container-'+all_Route[0]).show();
        // 添加開始按鈕的點擊事件處理器
        //device improve
        // const buttons = document.querySelectorAll('.button');
        // let startX, startY, isSwiping;

        // buttons.forEach(button => {
        //     button.addEventListener('touchstart', function(e) {
        //         const touch = e.touches[0];
        //         startX = touch.clientX;
        //         startY = touch.clientY;
        //         isSwiping = false;
        //     });

        //     button.addEventListener('touchmove', function(e) {
        //         const touch = e.touches[0];
        //         const diffX = touch.clientX - startX;
        //         const diffY = touch.clientY - startY;
        //         if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
        //             isSwiping = true;
        //         }
        //     });

        //     button.addEventListener('touchend', function(e) {
        //         if (!isSwiping) {
        //             performAction(this.dataset.id);
        //         }
        //     });
        // });

        // function performAction(buttonId) {
        //     alert('Button ' + buttonId + ' clicked!');
        // }

        function bind(){
            for(var fs = 0 ; fs < all_Route.length ; fs++){
            
                (function (fs) {
                    console.log('.c-'+all_Route[fs].replaceAll(' ',''))
                
                    
                    $('.c-'+all_Route[fs].replaceAll(' ','')+'.skip').on(mytap ,function(e){
                        console.log("skip", all_Route[fs])
                        if(fs == all_Route.length-1){
                            $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
                            get_recom_res();
                        }
                        else{
                            console.log('.c-'+all_Route[fs+1].replaceAll(' ',''))
                            $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
                            $('#container-'+all_Route[fs+1].replaceAll(' ','')).show();
                        }
                    });
                    
                    $('.c-'+all_Route[fs].replaceAll(' ','')+':not(.skip)').on(mytap ,function(e){
                        var tagid=$(this).attr('class').match(/tagId-(\d+)/)[1];
                        if(fs == all_Route.length-1){
                            $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
    
                            tags_chosen[all_Route[fs].replaceAll(' ','')] = [
                                {
                                    Description: 'example',
                                    Imgsrc: 'https://example.com/imageB1.png',
                                    Name: 'example',
                                    Tag: tagid,
                                    TagGroup: all_Route[fs]
                                }]
    
                            get_recom_res();
                        }
                        else{
                            $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
                            $('#container-'+all_Route[fs+1].replaceAll(' ','')).show();
                            tags_chosen[all_Route[fs].replaceAll(' ','')] = [
                                {
                                    Description: 'example',
                                    Imgsrc: 'https://example.com/imageB1.png',
                                    Name: 'example',
                                    Tag: tagid,
                                    TagGroup: all_Route[fs]
                                }]
                        }

                        console.log(tags_chosen)
                    })
                    $(`#container-${all_Route[fs].replaceAll(' ','')}-backarrow`).on(mytap ,function(e){
                        if(fs!=0){
                        $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
                        $('#container-'+all_Route[fs-1].replaceAll(' ','')).show();
                        }
                    
                    })
    
                    if(fs == 0){
                        reset = async function(){
                            $('#intro-page').show();
                            $('#container-'+all_Route[fs].replaceAll(' ','')).hide();
                            $('#container-recom').hide();
                            $(`#container-recom`).find('.axd_selections').children().remove();
                            const messageData = {
                                type: 'result',
                                value: false
                              };
                            window.parent.postMessage(messageData, '*');
                            tags_chosen = {}
    
                        }   
                    }
    
                })(fs);
            }


            

        }
        bind();

        var pass_data = {
           'MsgHeader'  :'fetchDone',
        };
        window.parent.postMessage(pass_data, '*');

    } catch (error) {
    console.error('Fetch error:', error);
    }
};
var tap =  ( window.ontouchstart === null ) ? 'touchend' : 'click';
$('#start-button').on(tap, function() {
    console.log('all_Route', all_Route)
    // 隱藏介紹頁面，顯示第一個推薦內容頁面
    $('#intro-page').hide();
    $('#container-'+all_Route[0]).show();

});

const Initial=()=>{
    $('.update_delete').remove();
    $('#container-recom').hide();
    
    tags_chosen = {};
}

window.addEventListener('message', async (event) => {
if(event.data.header=='from_preview')
{
    // location.reload();
    await Initial();


    ClothID=event.data.id;
    Brand=event.data.brand;
    console.log('change clothID: brand:', ClothID, Brand);

    fetchData();

    $('#intro-page').show();

    //finish Loading
    $('#loadingbar').hide();
    $('#pback').show();
    $("#containerback").show();
    
    


}
else{
;
}
console.log('Message received from parent:', event.data);

});
