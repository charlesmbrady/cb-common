/**
 Inline script to set theme before React hydrates (prevents flash).
 */

export function ThemeScript({
  defaultTheme = 'base',
  defaultColorMode = 'system',
  attrTarget = 'html',
}: {
  defaultTheme?: 'base' | 'glass' | 'sharp' | 'neo';
  defaultColorMode?: 'system' | 'dark' | 'light';
  attrTarget?: 'html' | 'body';
}) {
  const code = `
  (function(){
    var el = ${
      attrTarget === 'body' ? 'document.body' : 'document.documentElement'
    };
    el.setAttribute('data-theme','${defaultTheme}');
    var mode='${defaultColorMode}';
    if(mode==='dark'){ el.classList.add('dark'); }
    else if(mode==='light'){ el.classList.remove('dark'); }
    else{
      try{
        var m = window.matchMedia('(prefers-color-scheme: dark)').matches;
        el.classList.toggle('dark', m);
      }catch(e){}
    }
  })();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
