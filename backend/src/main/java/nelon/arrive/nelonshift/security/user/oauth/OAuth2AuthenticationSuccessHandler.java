package nelon.arrive.nelonshift.security.user.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nelon.arrive.nelonshift.security.jwt.JwtUtils;
import nelon.arrive.nelonshift.security.user.CustomUserDetails;
import nelon.arrive.nelonshift.security.utils.CookieUtil;
import nelon.arrive.nelonshift.services.RefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	
	private final JwtUtils jwtUtils;
	private final RefreshTokenService refreshTokenService;
	private final CookieUtil cookieUtil;
	
	@Value("${oauth2.redirect-uri:http://localhost:3000/oauth2/redirect}")
	private String redirectUri;
	
	@Override
	public void onAuthenticationSuccess(
		HttpServletRequest request,
		HttpServletResponse response,
		Authentication authentication
	) throws IOException {
		
		if (response.isCommitted()) {
			log.debug("Response has already been committed. Unable to redirect.");
			return;
		}
		
		CustomOAuth2User oauth2User = (CustomOAuth2User) authentication.getPrincipal();
		CustomUserDetails userDetails = CustomUserDetails.build(oauth2User.getUser());
		
		Authentication jwtAuthentication = new UsernamePasswordAuthenticationToken(
			userDetails,
			null,
			userDetails.getAuthorities()
		);
		
		String accessToken = jwtUtils.generateAccessToken(jwtAuthentication);
		String refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
		
		cookieUtil.setAccessTokenCookie(response, accessToken);
		cookieUtil.setRefreshTokenCookie(response, refreshToken);
		
		log.info("OAuth2 login successful for user: {}", oauth2User.getUser().getEmail());
		
		getRedirectStrategy().sendRedirect(request, response, redirectUri);
	}
}
