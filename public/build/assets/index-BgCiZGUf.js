import{X as T,d as i,j as e,R as z,S as L,e as S,A as M}from"./ContextMenuProvider-DoI9LuTu.js";import{L as $}from"./index-2Uq_Tr5V.js";import{B as A}from"./BreadCrumb-CcpWuY1k.js";import{Q as O}from"./react-toastify.esm-8BWsAHON.js";import{s as o}from"./showToast-BFjkHmvN.js";import{C as X}from"./CKEditorContent-Dr6McD_r.js";import{ModalCheckoutPlan as K}from"./ModalCheckoutPlan-r1YZaV5e.js";import{ModalSelectPaymentMethod as Q}from"./ModalSelectPaymentMethod-D_NgS18r.js";import{ModalPurchaseResult as V}from"./ModalPurchaseResult-DrCmuLuO.js";import{h as f}from"./moment-C5S46NFB.js";import{u as q}from"./useTranslation-Bh5zzBC_.js";import{C as G}from"./Container-AKEw1NBh.js";import{R as j}from"./Row-DaX0pFtU.js";import{C as l}from"./Col-BERnSmBs.js";import{C as p}from"./Card-BP66js0B.js";import{B as J}from"./Button-CdshqBqI.js";import"./index-B7rcZTdA.js";import"./RightSidebar-i7ET2Qab.js";import"./thunk-Dyk6Tozc.js";/* empty css                      */import"./LightDark-VYlQJ348.js";import"./isSymbol-CYvIzdD2.js";import"./ThemeProvider-CQKb4rSK.js";import"./reselect-CiXCCDx7.js";import"./useIsomorphicEffect-DSAwC7_u.js";import"./useWindow-B3mPSubg.js";import"./useMergedRefs-Cm3LQ1VB.js";import"./useEventCallback-Bsoi2xyD.js";import"./useEventCallback-BA23UYAQ.js";import"./AbstractModalHeader-Baf6fi1-.js";import"./querySelectorAll-rMMgkU1T.js";import"./hasClass-B9uJik72.js";import"./NoopTransition-Badst7zB.js";import"./TransitionWrapper-CRtjL7Sb.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./setPrototypeOf-DgZC2w_0.js";import"./DataKey-DjdvojM5.js";import"./CloseButton-feMrj_cP.js";import"./Fade-iG7JUvQW.js";import"./divWithClassName-Ct-4CK0x.js";import"./Collapse-CckE0-uK.js";import"./Form-C6Oq7frR.js";import"./logo-dark-CCAAFdaA.js";import"./logo-light-D3OEWz0M.js";import"./LanguageDropdown-DoeXY-nO.js";import"./Dropdown-CxMKodrb.js";import"./SSRProvider-CLk7drUW.js";import"./SelectableContext-Cn0HZByE.js";import"./NavbarContext-BuJEydxA.js";import"./Button-lElTeqs9.js";import"./hook-Crll79d-.js";import"./extends-CF3RwP-h.js";import"./Anchor-B8rOyTnZ.js";import"./InputGroupContext-CIB_KQgH.js";import"./user-dummy-img-BMkyJzBF.js";import"./Badge-DQdWXoKP.js";import"./avatar-1-PHP4S1R6.js";/* empty css                  */import"./react-number-format.es-CUqECRIb.js";import"./Modal-Ct9dsq7D.js";import"./useWillUnmount-CWisbIWq.js";import"./Alert-DmeDZGUk.js";const W=()=>{const{t:s}=q(),{plans:x,paymentMethods:c,currentUserPlan:t}=T().props,[C,d]=i.useState(!1),[_,h]=i.useState(!1),[k,g]=i.useState(!1),[y,u]=i.useState(null),[D,v]=i.useState(null),[w,N]=i.useState(null),m=i.useRef(null),R=async()=>{try{const a=route("seller.plan.ping"),r=await S.get(a);r.data.status==="success"&&(m.current&&(clearInterval(m.current),m.current=null),h(!1),d(!1),u(null),v(r.data.data),g(!0))}catch(a){console.error("Error pinging purchase status:",a)}};i.useEffect(()=>(m.current=setInterval(()=>{R()},3e3),()=>{m.current&&clearInterval(m.current)}),[]);const P=async a=>{if(!a){o(s("Invalid plan selected"),"error");return}if(!c||(c==null?void 0:c.length)===0){o(s("No payment methods available. Please contact support"),"error");return}N(a),M.reload({only:["paymentMethods"],onSuccess:()=>{d(!0),u(null)},onError:()=>{o(s("Failed to load payment methods"),"error")}})},Y=async a=>{if(!w){o(s("No plan selected"),"error");return}const r=c.find(n=>n.id===a);if(!r||!(r!=null&&r.id)){o(s("No valid payment method found. Please contact support"),"error");return}const b=route("seller.plan.checkout");await S.post(b,{plan_id:w,payment_method_id:r.id}).then(n=>{n.data.status==="success"?(u(n.data.data),d(!1),h(!0)):o(s(n.data.message),"error")}).catch(n=>{o(s(n.response.data.message),"error")})},B=()=>{d(!1),N(null)},E=()=>{h(!1),u(null),N(null)},F=()=>{g(!1),v(null)},I=()=>{g(!1),y?h(!0):d(!0)},H=()=>{h(!1),u(null),M.reload({only:["paymentMethods"],onSuccess:()=>{d(!0)},onError:()=>{o(s("Failed to load payment methods"),"error")}})};return e.jsxs(z.Fragment,{children:[e.jsx(L,{title:s("Subscription Plans")}),e.jsx("style",{children:`
          .pricing-box {
            border: 1px solid #e9ecef;
            border-radius: 0.75rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: visible;
          }
          .pricing-box:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          .best-choice-badge {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            background: #198754;
            color: white;
            padding: 4px 8px;
            border-radius: 15px;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.3px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            z-index: 10;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          .best-choice-badge i {
            font-size: 9px;
          }
          .plan-features ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .plan-features li {
            padding: 0.5rem 0;
            border-bottom: 1px solid #f8f9fa;
          }
          .plan-features li:last-child {
            border-bottom: none;
          }
          .plan-features .d-flex .flex-shrink-0 {
            width: 20px;
          }
          .plan-glow {
            position: relative;
          }
          .plan-glow::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, #198754, #20c997, #198754);
            border-radius: 0.85rem;
            z-index: -1;
            opacity: 0.7;
            animation: glow 2s ease-in-out infinite alternate;
          }
          @keyframes glow {
            from {
              opacity: 0.5;
            }
            to {
              opacity: 0.8;
            }
          }
        `}),e.jsxs("div",{className:"page-content",children:[e.jsx(Q,{show:C,onHide:B,paymentMethods:c,onSelectPaymentMethod:Y}),e.jsx(K,{show:_,onHide:E,data:y,onBack:H}),e.jsx(V,{show:k,onHide:F,data:D,onShowCheckout:I}),e.jsx(O,{}),e.jsxs(G,{fluid:!0,children:[e.jsx(A,{title:s("Subscription Plans"),pageTitle:s("Homepage")}),!!t&&e.jsx(j,{className:"justify-content-center mt-4",children:e.jsx(l,{lg:5,children:e.jsx("div",{className:"text-center mb-4",children:e.jsx("h4",{className:"fw-semibold fs-22",children:s("Current your plan")})})})}),!!t&&e.jsx(j,{className:"justify-content-center mb-5",children:e.jsx(l,{lg:8,children:e.jsx(p,{className:"pricing-box border-success shadow-lg",children:e.jsxs(p.Body,{className:"p-4",children:[e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("div",{className:"avatar-lg bg-success bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3",children:e.jsx("i",{className:"ri-vip-crown-line fs-1 text-success"})}),e.jsx("h4",{className:"fw-bold mb-2",children:t==null?void 0:t.name}),e.jsx("p",{className:"text-muted mb-0",children:s("Your Current Active Plan")})]}),e.jsxs(j,{className:"g-4",children:[e.jsx(l,{md:4,children:e.jsxs("div",{className:"text-center p-3 bg-light rounded",children:[e.jsxs("div",{className:"d-flex align-items-center justify-content-center mb-2",children:[e.jsx("i",{className:"ri-calendar-line text-primary me-2"}),e.jsx("h6",{className:"text-muted mb-0",children:s("Started On")})]}),e.jsx("p",{className:"mb-0 fw-bold h6",children:t!=null&&t.active_on?f(t.active_on).format("DD/MM/YYYY"):f(t.created_at).format("DD/MM/YYYY")})]})}),e.jsx(l,{md:4,children:e.jsxs("div",{className:"text-center p-3 bg-light rounded",children:[e.jsxs("div",{className:"d-flex align-items-center justify-content-center mb-2",children:[e.jsx("i",{className:"ri-calendar-check-line text-warning me-2"}),e.jsx("h6",{className:"text-muted mb-0",children:s("Expires On")})]}),e.jsx("p",{className:"mb-0 fw-bold h6",children:t!=null&&t.expires_on?f(t.expires_on).format("DD/MM/YYYY"):s("No expiration")})]})}),e.jsx(l,{md:4,children:e.jsxs("div",{className:"text-center p-3 bg-light rounded",children:[e.jsxs("div",{className:"d-flex align-items-center justify-content-center mb-2",children:[e.jsx("i",{className:"ri-time-line text-success me-2"}),e.jsx("h6",{className:"text-muted mb-0",children:s("Days Remaining")})]}),e.jsx("p",{className:"mb-0 fw-bold h6",children:t!=null&&t.expires_on?(()=>{const a=f(),b=f(t.expires_on).diff(a,"days");return b>0?`${b} ${s("days")}`:s("Expired")})():s("Unlimited")})]})})]}),((t==null?void 0:t.description)||(t==null?void 0:t.feature))&&e.jsxs("div",{className:"mt-4 pt-3 border-top",children:[(t==null?void 0:t.description)&&e.jsxs("div",{className:"mb-3",children:[e.jsx("h6",{className:"mb-2",children:s("Description")}),e.jsx("div",{className:"text-muted small",dangerouslySetInnerHTML:{__html:t.description}})]}),(t==null?void 0:t.feature)&&e.jsxs("div",{children:[e.jsx("h6",{className:"mb-2",children:s("Features")}),e.jsx("div",{className:"text-muted small",dangerouslySetInnerHTML:{__html:t.feature}})]})]})]})})})}),!!x&&x.length>0&&e.jsx(j,{className:"justify-content-center mt-5",children:e.jsx(l,{lg:8,children:e.jsxs("div",{className:"text-center mb-4",children:[e.jsx("h4",{className:"fw-semibold fs-22",children:s("Choose the plan that's right for you")}),e.jsx("p",{className:"text-muted mb-0",children:s("Explore subscription plans designed to fit your needs")})]})})}),e.jsx(j,{className:"justify-content-center",children:x&&x.length>0?x.map(a=>{const r=t&&t.id===a.id;return e.jsx(l,{xxl:3,lg:6,className:"mb-4",children:e.jsxs(p,{className:`pricing-box h-100 ${a.best_choice?"best-choice":""}`,children:[!!a.best_choice&&e.jsxs("div",{className:"best-choice-badge",style:{width:"fit-content",padding:"4px 8px",fontSize:"12px"},children:[e.jsx("i",{className:"ri-star-fill"}),e.jsx("span",{children:s("Best choice")})]}),e.jsxs(p.Body,{className:"bg-light m-2 p-4",children:[e.jsxs("div",{className:"d-flex align-items-center mb-3",children:[e.jsx("div",{className:"flex-grow-1",children:e.jsx("h5",{className:"mb-0 fw-semibold",children:a.name})}),e.jsx("div",{className:"ms-auto",children:e.jsx("h2",{className:"mb-0",children:a.price===0?e.jsx("span",{className:"fs-5",children:s("Free")}):e.jsxs(e.Fragment,{children:[new Intl.NumberFormat("vi-VN").format(a.price)," ",e.jsx("small",{className:"fs-13",children:"đ"}),e.jsxs("small",{className:"fs-13 text-muted",children:["/",a.interval," ",s("days")]})]})})})]}),!!a.sub_description&&e.jsx("p",{className:"text-muted",children:a.sub_description}),!!a.feature&&e.jsx("div",{className:"mb-4",children:e.jsx("div",{className:"plan-features",dangerouslySetInnerHTML:{__html:a.feature}})}),e.jsx("div",{className:"mt-3 pt-2",children:e.jsx(J,{variant:r?"secondary":"primary",className:`w-100 ${r?"disabled":""}`,onClick:()=>P(a.id),disabled:r,children:r?e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"ri-check-line me-2"}),s("Current Plan")]}):e.jsxs(e.Fragment,{children:[e.jsx("i",{className:"ri-arrow-right-line me-2"}),s("Select Plan")]})})}),!!a.description&&e.jsxs("div",{className:"mt-3 pt-3 border-top",children:[e.jsx("h6",{className:"text-uppercase text-muted mb-2 fw-bold",style:{fontSize:"12px"},children:s("Description")}),e.jsx("div",{className:"text-muted small",children:e.jsx(X,{htmlContent:a.description})})]})]})]})},a.id)}):e.jsx(l,{xs:12,children:e.jsx(p,{className:"text-center py-5",children:e.jsxs(p.Body,{children:[e.jsx("i",{className:"ri-inbox-line display-4 text-muted mb-3"}),e.jsx("h5",{className:"text-muted",children:s("No plans available")}),e.jsx("p",{className:"text-muted",children:s("Please check back later")})]})})})})]})]})]})};W.layout=s=>e.jsx($,{children:s});export{W as default};
