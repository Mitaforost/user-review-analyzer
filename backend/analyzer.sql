PGDMP      :                }            analyzer    17.4    17.2 F    |           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            }           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            ~           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    24839    analyzer    DATABASE     n   CREATE DATABASE analyzer WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'ru-RU';
    DROP DATABASE analyzer;
                     postgres    false            �            1255    24954    extract_keywords()    FUNCTION     V  CREATE FUNCTION public.extract_keywords() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    words TEXT[];
    word TEXT;
    key_id INT;
BEGIN
    words := string_to_array(NEW.review_text, ' ');
    FOR word IN SELECT unnest(words) LOOP
        word := lower(word);
        IF length(word) > 3 THEN  -- Исключаем слишком короткие слова
            SELECT id INTO key_id FROM keywords WHERE keyword = word;
            IF key_id IS NULL THEN
                INSERT INTO keywords (keyword) VALUES (word) RETURNING id INTO key_id;
            END IF;
            INSERT INTO review_keywords (review_id, keyword_id, occurrences) VALUES (NEW.id, key_id, 1)
            ON CONFLICT (review_id, keyword_id) DO UPDATE SET occurrences = review_keywords.occurrences + 1;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$;
 )   DROP FUNCTION public.extract_keywords();
       public               postgres    false            �            1255    24955    update_review_statistics()    FUNCTION     �  CREATE FUNCTION public.update_review_statistics() RETURNS trigger
    LANGUAGE plpgsql
    AS $$  
DECLARE  
    avg_rating DECIMAL(3,2);  
    popular_keyword TEXT;  
BEGIN  
    -- Рассчитываем средний рейтинг  
    SELECT COALESCE(AVG(rating), 0) INTO avg_rating FROM reviews;  

    -- Определяем самое популярное ключевое слово  
    SELECT k.keyword  
    INTO popular_keyword  
    FROM review_keywords rk  
    JOIN keywords k ON rk.keyword_id = k.id  
    GROUP BY k.keyword  
    ORDER BY SUM(rk.occurrences) DESC  
    LIMIT 1;  

    -- Обновляем таблицу статистики  
    INSERT INTO review_statistics (average_rating, most_popular_keyword, last_updated)  
    VALUES (avg_rating, popular_keyword, NOW())  
    ON CONFLICT (id) DO UPDATE  
    SET average_rating = avg_rating,  
        most_popular_keyword = popular_keyword,  
        last_updated = NOW();  

    RETURN NULL;  
END;  
$$;
 1   DROP FUNCTION public.update_review_statistics();
       public               postgres    false            �            1259    24901    keywords    TABLE     f   CREATE TABLE public.keywords (
    id integer NOT NULL,
    keyword character varying(50) NOT NULL
);
    DROP TABLE public.keywords;
       public         heap r       postgres    false            �            1259    24910    review_keywords    TABLE     �   CREATE TABLE public.review_keywords (
    id integer NOT NULL,
    review_id integer,
    keyword_id integer,
    occurrences integer DEFAULT 1
);
 #   DROP TABLE public.review_keywords;
       public         heap r       postgres    false            �            1259    24885    reviews    TABLE       CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer,
    rating integer,
    review_text text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);
    DROP TABLE public.reviews;
       public         heap r       postgres    false            �            1259    24959    admin_review_statistics    VIEW     q  CREATE VIEW public.admin_review_statistics AS
 SELECT count(*) AS total_reviews,
    avg(rating) AS average_rating,
    ( SELECT k.keyword
           FROM (public.keywords k
             JOIN public.review_keywords rk ON ((k.id = rk.keyword_id)))
          GROUP BY k.keyword
          ORDER BY (count(*)) DESC
         LIMIT 5) AS top_keywords
   FROM public.reviews;
 *   DROP VIEW public.admin_review_statistics;
       public       v       postgres    false    226    224    224    222            �            1259    24900    keywords_id_seq    SEQUENCE     �   CREATE SEQUENCE public.keywords_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.keywords_id_seq;
       public               postgres    false    224            �           0    0    keywords_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.keywords_id_seq OWNED BY public.keywords.id;
          public               postgres    false    223            �            1259    24909    review_keywords_id_seq    SEQUENCE     �   CREATE SEQUENCE public.review_keywords_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 -   DROP SEQUENCE public.review_keywords_id_seq;
       public               postgres    false    226            �           0    0    review_keywords_id_seq    SEQUENCE OWNED BY     Q   ALTER SEQUENCE public.review_keywords_id_seq OWNED BY public.review_keywords.id;
          public               postgres    false    225            �            1259    24944    review_statistics    TABLE     �   CREATE TABLE public.review_statistics (
    id integer NOT NULL,
    average_rating numeric(3,2) DEFAULT 0.00,
    most_popular_keyword character varying(50),
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
 %   DROP TABLE public.review_statistics;
       public         heap r       postgres    false            �            1259    24943    review_statistics_id_seq    SEQUENCE     �   CREATE SEQUENCE public.review_statistics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 /   DROP SEQUENCE public.review_statistics_id_seq;
       public               postgres    false    230            �           0    0    review_statistics_id_seq    SEQUENCE OWNED BY     U   ALTER SEQUENCE public.review_statistics_id_seq OWNED BY public.review_statistics.id;
          public               postgres    false    229            �            1259    24884    reviews_id_seq    SEQUENCE     �   CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.reviews_id_seq;
       public               postgres    false    222            �           0    0    reviews_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
          public               postgres    false    221            �            1259    24856    roles    TABLE     e   CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(50) NOT NULL
);
    DROP TABLE public.roles;
       public         heap r       postgres    false            �            1259    24855    roles_id_seq    SEQUENCE     �   CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.roles_id_seq;
       public               postgres    false    218            �           0    0    roles_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;
          public               postgres    false    217            �            1259    24928    sessions    TABLE     �   CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer,
    session_token text NOT NULL,
    expires_at timestamp without time zone NOT NULL
);
    DROP TABLE public.sessions;
       public         heap r       postgres    false            �            1259    24927    sessions_id_seq    SEQUENCE     �   CREATE SEQUENCE public.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.sessions_id_seq;
       public               postgres    false    228            �           0    0    sessions_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;
          public               postgres    false    227            �            1259    24865    users    TABLE       CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash text NOT NULL,
    role_id integer DEFAULT 2,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.users;
       public         heap r       postgres    false            �            1259    24864    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public               postgres    false    220            �           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public               postgres    false    219            �           2604    24904    keywords id    DEFAULT     j   ALTER TABLE ONLY public.keywords ALTER COLUMN id SET DEFAULT nextval('public.keywords_id_seq'::regclass);
 :   ALTER TABLE public.keywords ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    223    224    224            �           2604    24913    review_keywords id    DEFAULT     x   ALTER TABLE ONLY public.review_keywords ALTER COLUMN id SET DEFAULT nextval('public.review_keywords_id_seq'::regclass);
 A   ALTER TABLE public.review_keywords ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            �           2604    24947    review_statistics id    DEFAULT     |   ALTER TABLE ONLY public.review_statistics ALTER COLUMN id SET DEFAULT nextval('public.review_statistics_id_seq'::regclass);
 C   ALTER TABLE public.review_statistics ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    230    229    230            �           2604    24888 
   reviews id    DEFAULT     h   ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);
 9   ALTER TABLE public.reviews ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    221    222            �           2604    24859    roles id    DEFAULT     d   ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);
 7   ALTER TABLE public.roles ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    218    217    218            �           2604    24931    sessions id    DEFAULT     j   ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);
 :   ALTER TABLE public.sessions ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    228    227    228            �           2604    24868    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    220    220            s          0    24901    keywords 
   TABLE DATA           /   COPY public.keywords (id, keyword) FROM stdin;
    public               postgres    false    224   DY       u          0    24910    review_keywords 
   TABLE DATA           Q   COPY public.review_keywords (id, review_id, keyword_id, occurrences) FROM stdin;
    public               postgres    false    226   0Z       y          0    24944    review_statistics 
   TABLE DATA           c   COPY public.review_statistics (id, average_rating, most_popular_keyword, last_updated) FROM stdin;
    public               postgres    false    230   �Z       q          0    24885    reviews 
   TABLE DATA           O   COPY public.reviews (id, user_id, rating, review_text, created_at) FROM stdin;
    public               postgres    false    222   [       m          0    24856    roles 
   TABLE DATA           .   COPY public.roles (id, role_name) FROM stdin;
    public               postgres    false    218   \       w          0    24928    sessions 
   TABLE DATA           J   COPY public.sessions (id, user_id, session_token, expires_at) FROM stdin;
    public               postgres    false    228   k\       o          0    24865    users 
   TABLE DATA           X   COPY public.users (id, username, email, password_hash, role_id, created_at) FROM stdin;
    public               postgres    false    220   �\       �           0    0    keywords_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.keywords_id_seq', 18, true);
          public               postgres    false    223            �           0    0    review_keywords_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public.review_keywords_id_seq', 20, true);
          public               postgres    false    225            �           0    0    review_statistics_id_seq    SEQUENCE SET     F   SELECT pg_catalog.setval('public.review_statistics_id_seq', 4, true);
          public               postgres    false    229            �           0    0    reviews_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.reviews_id_seq', 3, true);
          public               postgres    false    221            �           0    0    roles_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.roles_id_seq', 2, true);
          public               postgres    false    217            �           0    0    sessions_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.sessions_id_seq', 1, false);
          public               postgres    false    227            �           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 4, true);
          public               postgres    false    219            �           2606    24908    keywords keywords_keyword_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_keyword_key UNIQUE (keyword);
 G   ALTER TABLE ONLY public.keywords DROP CONSTRAINT keywords_keyword_key;
       public                 postgres    false    224            �           2606    24906    keywords keywords_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.keywords DROP CONSTRAINT keywords_pkey;
       public                 postgres    false    224            �           2606    24916 $   review_keywords review_keywords_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.review_keywords
    ADD CONSTRAINT review_keywords_pkey PRIMARY KEY (id);
 N   ALTER TABLE ONLY public.review_keywords DROP CONSTRAINT review_keywords_pkey;
       public                 postgres    false    226            �           2606    24953 &   review_keywords review_keywords_unique 
   CONSTRAINT     r   ALTER TABLE ONLY public.review_keywords
    ADD CONSTRAINT review_keywords_unique UNIQUE (review_id, keyword_id);
 P   ALTER TABLE ONLY public.review_keywords DROP CONSTRAINT review_keywords_unique;
       public                 postgres    false    226    226            �           2606    24951 (   review_statistics review_statistics_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public.review_statistics
    ADD CONSTRAINT review_statistics_pkey PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.review_statistics DROP CONSTRAINT review_statistics_pkey;
       public                 postgres    false    230            �           2606    24894    reviews reviews_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_pkey;
       public                 postgres    false    222            �           2606    24861    roles roles_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_pkey;
       public                 postgres    false    218            �           2606    24863    roles roles_role_name_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);
 C   ALTER TABLE ONLY public.roles DROP CONSTRAINT roles_role_name_key;
       public                 postgres    false    218            �           2606    24935    sessions sessions_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_pkey;
       public                 postgres    false    228            �           2606    24937 #   sessions sessions_session_token_key 
   CONSTRAINT     g   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_session_token_key UNIQUE (session_token);
 M   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_session_token_key;
       public                 postgres    false    228            �           2606    24878    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public                 postgres    false    220            �           2606    24874    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public                 postgres    false    220            �           2606    24876    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public                 postgres    false    220            �           2620    24956    reviews trg_extract_keywords    TRIGGER     |   CREATE TRIGGER trg_extract_keywords AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.extract_keywords();
 5   DROP TRIGGER trg_extract_keywords ON public.reviews;
       public               postgres    false    232    222            �           2620    24958 $   reviews trg_update_review_statistics    TRIGGER     �   CREATE TRIGGER trg_update_review_statistics AFTER INSERT ON public.reviews FOR EACH STATEMENT EXECUTE FUNCTION public.update_review_statistics();
 =   DROP TRIGGER trg_update_review_statistics ON public.reviews;
       public               postgres    false    233    222            �           2620    24957 !   reviews trigger_update_statistics    TRIGGER     �   CREATE TRIGGER trigger_update_statistics AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_review_statistics();
 :   DROP TRIGGER trigger_update_statistics ON public.reviews;
       public               postgres    false    233    222            �           2606    24922 /   review_keywords review_keywords_keyword_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.review_keywords
    ADD CONSTRAINT review_keywords_keyword_id_fkey FOREIGN KEY (keyword_id) REFERENCES public.keywords(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.review_keywords DROP CONSTRAINT review_keywords_keyword_id_fkey;
       public               postgres    false    4807    224    226            �           2606    24917 .   review_keywords review_keywords_review_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.review_keywords
    ADD CONSTRAINT review_keywords_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;
 X   ALTER TABLE ONLY public.review_keywords DROP CONSTRAINT review_keywords_review_id_fkey;
       public               postgres    false    226    222    4803            �           2606    24895    reviews reviews_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 F   ALTER TABLE ONLY public.reviews DROP CONSTRAINT reviews_user_id_fkey;
       public               postgres    false    4799    222    220            �           2606    24938    sessions sessions_user_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;
 H   ALTER TABLE ONLY public.sessions DROP CONSTRAINT sessions_user_id_fkey;
       public               postgres    false    228    4799    220            �           2606    24879    users users_role_id_fkey    FK CONSTRAINT     w   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_role_id_fkey;
       public               postgres    false    220    4793    218            s   �   x�m�1R�@Ek�[��ı�e((B;�	�^�	1,�+H7⯝��f��������_>�q%v����[\��}k��6�s	OuU�D��o�;YO�,XȨ"T�k����j�b�<��(�A��r�U����?�8�\�7_��ޭc�e��rKT�猝A�@�g�4iC�ɍ9ף�N�An��Ď��쓝����_�%��� �X���      u   \   x���� ���0��.���[^�c�j�D-L��D#L4�D+L�s{�'<�ϑ;�`�gc�;F�=Txb�xa�xc�`�� t~��A�J      y   W   x�3�4�36漰���{���/l�v\ء�id`d�k`�kh�`hiehfed�ghhdhn�e�W����_^�O�1�*M�V���� �12      q     x�}�1N1Ek�)�de{YBrJ((��&HA�D�(��&İ��
n�oG 
������|g�)�������`�s�� �T���X�әػSk���R��	Z^�j�u���m.x�ޑ�	[A�4��Zi�o}9����č��d�]�wC�E+��+'W�����,qS�{�B籈����w��h�~L�ϤF&e=I��|t�Oa���E�)������֧�����t��h����t��������Y�zK.��F��,�vy��Z      m   B   x�3�0�{.츰����.6\�p��¾�\F��_�wa�Şہ�&��V�+F��� ��%�      w      x������ � �      o   �   x���A
�0EדS���� �0Ҡ�HRB�}��mq�����.�?��m�8��0��T]#ۆ���A*�R�N(p����;�re�yLө��@��יM�.�X�"��]��l�lws8vT�Jw%OB|oWJ7     