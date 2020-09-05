package studentsync.selfies;

import com.google.gson.JsonObject;

import java.util.*;

import static java.util.Collections.EMPTY_LIST;

public abstract class AuthConnection {
    private static Map<String, AuthConnection> INSTANCES = new HashMap<>();

    public static synchronized AuthConnection get(Properties properties) {
      AuthConnection connection = INSTANCES.get(Instances.CLIENT.get());
      if (connection == null) {
        properties = new Properties(properties);
        System.out.println("New LDAPConnection\n" + properties.toString());
        connection = new PaedMLConnection(properties);

        INSTANCES.put(Instances.CLIENT.get(), connection);
      }
      return connection;
    }

    public static synchronized void kick() {
        INSTANCES.remove(Instances.CLIENT.get());
    }

    abstract Set<String> doauthenticate(String user, String password);

    public abstract List<JsonObject> readStudents();

    public abstract List<JsonObject> readClasses();

    public abstract List<JsonObject> filterIdentities(String search);

    public abstract List<JsonObject> expandClass(String expand);


    private static class NoConnection extends AuthConnection {
        @Override
        Set<String> doauthenticate(String user, String password) {
            return null;
        }

        @Override
        public List<JsonObject> readStudents() {
            return EMPTY_LIST;
        }

        @Override
        public List<JsonObject> readClasses() {
            return EMPTY_LIST;
        }

        @Override
        public List<JsonObject> filterIdentities(String search) {
            return EMPTY_LIST;
        }

        @Override
        public List<JsonObject> expandClass(String expand) {
            return EMPTY_LIST;
        }
    }
}
