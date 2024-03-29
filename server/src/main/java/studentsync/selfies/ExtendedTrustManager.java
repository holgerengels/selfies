package studentsync.selfies;

import com.google.gson.JsonObject;

import javax.net.ssl.*;
import java.io.FileInputStream;
import java.net.URLConnection;
import java.security.KeyStore;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.Arrays;
import java.util.Map;
import java.util.Properties;

public class ExtendedTrustManager
    implements X509TrustManager
{
    private static ExtendedTrustManager INSTANCE;

    public static synchronized ExtendedTrustManager getInstance(Properties properties) {
        if (INSTANCE == null) {
            try {
                TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                tmf.init((KeyStore)null);

                // Get hold of the default trust manager
                X509TrustManager defaultTm = null;
                for (TrustManager tm : tmf.getTrustManagers()) {
                    if (tm instanceof X509TrustManager) {
                        defaultTm = (X509TrustManager)tm;
                        break;
                    }
                }

                FileInputStream myKeys = new FileInputStream(properties.getProperty("auth.trustStore"));
                System.out.println("properties = " + properties);
                KeyStore myTrustStore = KeyStore.getInstance(KeyStore.getDefaultType());
                myTrustStore.load(myKeys, properties.getProperty("auth.trustStorePassword").toCharArray());
                myKeys.close();

                tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
                tmf.init(myTrustStore);

                X509TrustManager myTm = null;
                for (TrustManager tm : tmf.getTrustManagers()) {
                    if (tm instanceof X509TrustManager) {
                        myTm = (X509TrustManager)tm;
                        break;
                    }
                }

                final X509TrustManager finalDefaultTm = defaultTm;
                final X509TrustManager finalMyTm = myTm;

                INSTANCE = new ExtendedTrustManager(finalDefaultTm, finalMyTm);

                String protocoll = "TLS";
                SSLContext sslContext = SSLContext.getInstance(protocoll);
                sslContext.init(null, new TrustManager[] { INSTANCE }, new SecureRandom());
                SSLContext.setDefault(sslContext);
                System.out.println("Extended TrustManager installed successfully for " + protocoll);
            }
            catch (Exception e) {
                throw new RuntimeException(e);
            }
        }
        return INSTANCE;
    }

    private final X509TrustManager finalDefaultTm;
    private final X509TrustManager finalMyTm;

    public ExtendedTrustManager(X509TrustManager finalDefaultTm, X509TrustManager finalMyTm) {
        this.finalDefaultTm = finalDefaultTm;
        this.finalMyTm = finalMyTm;
    }

    @Override
    public X509Certificate[] getAcceptedIssuers() {
        return finalDefaultTm.getAcceptedIssuers();
    }

    @Override
    public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        try {
            if ("CN=DC01.musterschule.schule.paedml".equals(chain[0].getSubjectDN().toString()))
                return;

            System.out.println("TRUSTMANAGER MY " + authType);
            finalMyTm.checkServerTrusted(chain, authType);
            System.out.println("TRUSTMANAGER MY OK");
        }
        catch (CertificateException e) {
            finalDefaultTm.checkServerTrusted(chain, authType);
        }
    }

    @Override
    public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
        finalDefaultTm.checkClientTrusted(chain, authType);
    }
}
