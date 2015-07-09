#ifdef GL_ES
precision highp float;
#endif

uniform float iGlobalTime;
uniform vec2 iResolution;

float rand(vec2 co){
    return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float ball(vec3 position, vec3 coord, float r)
{
    return length(position - coord) - r;
}

float scene(vec3 position)
{
    return min
    (
        ball(position, vec3((sin(iGlobalTime*0.4)*1.0), (cos(iGlobalTime*0.4)*1.0), (4.0 + (sin(iGlobalTime)*3.7))), 0.3),
        ball(position, vec3((sin(iGlobalTime*0.8)*1.2), (cos(iGlobalTime*0.8)*1.2), (4.0+(sin(iGlobalTime*1.8)*3.8))), 0.4)
    );
}

float march(vec3 ray, vec3 cam)
{
    vec3 position = cam;
    for(int i=0; i<12; i++)
    {
        float dist = scene(position);
        position += dist * ray;
    }
    return length(position - cam);
}

float raymarcher()
{
    vec2 pos = (gl_FragCoord.xy / iResolution.yy) - vec2((iResolution.x/iResolution.y) * 0.5, 0.5);
    
    vec3 cam = vec3(0.0, 0.0, -2.0);
    vec3 ray = normalize(vec3(pos, 1.0));
    float lum = (1.0 / sqrt(march(ray, cam)));
    return lum + (lum*rand(pos+iGlobalTime)*0.4);
}

vec3 plasma()
{
    float t = iGlobalTime * 0.4;
    vec2 pos = (gl_FragCoord.xy / iResolution.yy) - vec2((iResolution.x/iResolution.y) * 0.5, 0.5);
    float a = sin(t * 1.2);
    pos *= (1.5 + (sin(t)*1.0)); //zoom
    pos = vec2((pos.x * cos(a)) - (pos.y * sin(a)), (pos.x * sin(a)) + (pos.y * cos(a))); // pyöritys
    
    float l = 0.5 + (sin(pos.y*20.0)*0.5) +
                    (cos(pos.x*20.0)*0.5);
                    
    l = 0.5 + (sin(l * ((20.0 * sin(t/2.0)) + 24.0)) * 0.5);

    l += 0.5 + (cos(pos.y*1.1*(50.0+sin(t)*10.0))*0.5);    
    l += 0.5 + (cos(pos.x*0.9*(40.0+sin(t)*20.0))*0.5);    

    l *= 0.5;
    l += (0.1 * rand(pos+t));

    l *= 0.9 + (sin(pos.y*1.3*(2.0+(sin(iGlobalTime)*0.9)))*0.05) +
               (cos(pos.x*1.5*(3.0+(sin(iGlobalTime)*0.4)))*0.05);

    return vec3((0.5+sin(t+(sin(pos.x*(sin(t)*3.8))*0.5)))*l,
                (0.5+cos(t+(cos(pos.y*(cos(t/2.0)*4.4)*0.8))))*l,
                ((0.5+sin(t/3.0)*0.5)*l + (0.08*rand(pos + t))));
}

void main()
{
    gl_FragColor = vec4(plasma() * raymarcher(), 0.25);
}
